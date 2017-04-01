(function(angular, require, sha512, sha256, uuid) {
    'use strict';

    function InvalidRecoveryCodeException(message) {
        this.message = message;
        this.name = "InvalidRecoveryCodeException";
    }

    var cryptoLibrary = function(helper) {

        /**
         * @ngdoc service
         * @name psonocli.cryptoLibrary
         *
         * @description
         * Service with all the cryptographic operations
         */

        var nacl = require('ecma-nacl');
        var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#randomBytes
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Random byte generator from nacl_factory.js
         * https://github.com/tonyg/js-nacl
         *
         * @param {int} count The amount of random bytes to return
         *
         * @returns {Uint8Array} Random byte array
         */
        var randomBytes = function (count) {

            if (typeof module !== 'undefined' && module.exports) {
                // add node.js implementations
                var crypto = require('crypto');
                return crypto.randomBytes(count)
            } else if (window && window.crypto && window.crypto.getRandomValues) {
                // add in-browser implementation
                var bs = new Uint8Array(count);
                window.crypto.getRandomValues(bs);
                return bs;
            } else {
                throw { name: "No cryptographic random number generator",
                    message: "Your browser does not support cryptographic random number generation." };
            }
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#encode_utf8
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * encodes utf8 from nacl_factory.js
         * https://github.com/tonyg/js-nacl
         *
         * @param {string} to_encode String to encode
         *
         * @returns {string} Encoded string
         */
        var encode_utf8 = function (to_encode) {

            return encode_latin1(unescape(encodeURIComponent(to_encode)));
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#encode_latin1
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * encodes latin1 from nacl_factory.js
         * https://github.com/tonyg/js-nacl
         *
         * @param {string} to_encode String to encode
         *
         * @returns {string} Encoded string
         */
        var encode_latin1 = function (to_encode) {

            var result = new Uint8Array(to_encode.length);
            for (var i = 0; i < to_encode.length; i++) {
                var c = to_encode.charCodeAt(i);
                if ((c & 0xff) !== c) throw {message: "Cannot encode string in Latin1", str: to_encode};
                result[i] = (c & 0xff);
            }
            return result;
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#decode_utf8
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * decodes utf8 from nacl_factory.js
         * https://github.com/tonyg/js-nacl
         *
         * @param {string} to_decode encoded utf-8 string
         *
         * @returns {string} Decoded string
         */
        var decode_utf8 = function (to_decode) {

            return decodeURIComponent(escape(decode_latin1(to_decode)));
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#decode_latin1
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * decodes latin1 from nacl_factory.js
         * https://github.com/tonyg/js-nacl
         *
         * @param {string} to_decode encoded latin1 string
         *
         * @returns {string} Decoded string
         */
        var decode_latin1 = function (to_decode) {

            var encoded = [];
            for (var i = 0; i < to_decode.length; i++) {
                encoded.push(String.fromCharCode(to_decode[i]));
            }
            return encoded.join('');
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#to_hex
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Uint8Array to hex converter from nacl_factory.js
         * https://github.com/tonyg/js-nacl
         *
         * @param {Uint8Array} val As Uint8Array encoded value
         *
         * @returns {string} Returns hex representation
         */
        var to_hex = function (val) {

            var encoded = [];
            for (var i = 0; i < val.length; i++) {
                encoded.push("0123456789abcdef"[(val[i] >> 4) & 15]);
                encoded.push("0123456789abcdef"[val[i] & 15]);
            }
            return encoded.join('');
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#from_hex
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * hex to Uint8Array converter from nacl_factory.js
         * https://github.com/tonyg/js-nacl
         *
         * @param {string} val As hex encoded value
         *
         * @returns {Uint8Array} Returns Uint8Array representation
         */
        var from_hex = function (val) {

            var result = new Uint8Array(val.length / 2);
            for (var i = 0; i < val.length / 2; i++) {
                result[i] = parseInt(val.substr(2*i,2),16);
            }
            return result;
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#base_x_lookup_table
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Helper function to create a lookup map of a given alphabet
         * (based on https://github.com/cryptocoinjs/base-x)
         *
         * @param {string} alphabet The alphabet as string
         *
         * @returns {object} Returns the lookup map
         */
        var base_x_lookup_table = function(alphabet) {

            var alphabet_map = {};
            // pre-compute lookup table
            for (var z = 0; z < alphabet.length; z++) {
                var x = alphabet.charAt(z);

                if (alphabet_map[x] !== undefined) {
                    throw new TypeError(x + ' is ambiguous');
                }
                alphabet_map[x] = z;
            }
            return alphabet_map;
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#to_base_x
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Uint8Array to base X converter
         * (based on https://github.com/cryptocoinjs/base-x)
         *
         * @param {Uint8Array} val As Uint8Array encoded value
         * @param {string} alphabet The alphabet as string
         *
         * @returns {string} Returns base X representation
         */
        var to_base_x = function (val, alphabet) {

            var base = alphabet.length;

            if (val.length === 0) return '';

            var digits = [0];
            for (var i = 0; i < val.length; ++i) {
                for (var j = 0, carry = val[i]; j < digits.length; ++j) {
                    carry += digits[j] << 8;
                    digits[j] = carry % base;
                    carry = (carry / base) | 0;
                }

                while (carry > 0) {
                    digits.push(carry % base);
                    carry = (carry / base) | 0;
                }
            }

            var string = '';

            // deal with leading zeros
            for (var k = 0; val[k] === 0 && k < val.length - 1; ++k) {
                string += alphabet[0];
            }

            // convert digits to a string
            for (var q = digits.length - 1; q >= 0; --q) {
                string += alphabet[digits[q]];
            }

            return string
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#from_base_x
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * base X to Uint8Array converter
         * (based on https://github.com/cryptocoinjs/base-x)
         *
         * @param {string} val As base X encoded value
         * @param {string} alphabet The alphabet as string
         *
         * @returns {Uint8Array} Returns Uint8Array representation
         */
        var from_base_x = function (val, alphabet) {

            var base = alphabet.length;
            var leader = alphabet.charAt(0);
            var alphabet_map = base_x_lookup_table(alphabet);

            if (val.length === 0) {
                return new Uint8Array(0);
            }

            var bytes = [0];
            for (var i = 0; i < val.length; i++) {
                var value = alphabet_map[val[i]];
                if (value === undefined) {
                    throw new Error('Non-base' + base + ' character')
                }

                for (var j = 0, carry = value; j < bytes.length; ++j) {
                    carry += bytes[j] * base;
                    bytes[j] = carry & 0xff;
                    carry >>= 8;
                }

                while (carry > 0) {
                    bytes.push(carry & 0xff);
                    carry >>= 8;
                }
            }

            // deal with leading zeros
            for (var k = 0; val[k] === leader && k < val.length - 1; ++k) {
                bytes.push(0);
            }

            var representation = new Uint8Array(bytes.length);

            for (var l = 0; l < bytes.length; l++) {
                representation[l] = bytes[bytes.length - l - 1];
            }

            return representation;
        };


        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#to_base58
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Uint8Array to base58 converter
         * (based on https://github.com/cryptocoinjs/base-x)
         *
         * @param {Uint8Array} val As Uint8Array encoded value
         *
         * @returns {string} Returns base58 representation
         */
        var to_base58 = function (val) {
            return to_base_x(val, BASE58);
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#from_base58
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * base58 to Uint8Array converter
         * (based on https://github.com/cryptocoinjs/base-x)
         *
         * @param {string} val As base58 encoded value
         *
         * @returns {Uint8Array} Returns Uint8Array representation
         */
        var from_base58 = function (val) {
            return from_base_x(val, BASE58);
        };


        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#hex_to_base58
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * hex to uuid converter
         *
         * @param {string} val The hex one wants to convert
         *
         * @returns {string} Returns base58 representation
         */
        var hex_to_base58 = function(val) {
            return to_base58(from_hex(val));
        };


        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#base58_to_hex
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Base58 to hex converter
         *
         * @param {string} val The base58 one wants to convert
         *
         * @returns {string} Returns hex representation
         */
        var base58_to_hex = function(val) {
            return to_hex(from_base58(val));
        };


        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#uuid_to_hex
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * uuid to hex converter
         *
         * @param {string} val The uuid one wants to convert
         *
         * @returns {string} Returns hex representation
         */
        var uuid_to_hex = function(val) {
            return val.replace(/-/g, '');
        };


        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#hex_to_uuid
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * hex to uuid converter
         *
         * @param {string} val The hex representation of a uuid one wants to convert
         *
         * @returns {uuid} Returns uuid
         */
        var hex_to_uuid = function(val) {
            return uuid.unparse(from_hex(val));
        };

        var Mnemonic = function () {

            // Mnemonic.js v. 1.1.0

            // (c) 2012-2015 Yiorgis Gozadinos, Crypho AS.
            // Mnemonic.js is distributed under the MIT license.
            // http://github.com/ggozad/mnemonic.js

            // AMD/global registrations


            var Mnemonic = function (args) {
                this.seed = args;
                return this;
            };

            Mnemonic.prototype.toHex = function () {
                var l = this.seed.length, res = '', i = 0;
                for (; i < l; i++) {
                    res += ('00000000' + this.seed[i].toString(16)).substr(-8);
                }
                return res;
            };

            Mnemonic.prototype.toWords = function () {
                var i = 0,
                    l = this.seed.length,
                    n = Mnemonic.wc,
                    words = [], x, w1, w2, w3;
                for (; i < l; i++) {
                    x = this.seed[i];
                    w1 = x % n;
                    w2 = (((x / n) >> 0) + w1 ) % n;
                    w3 = (((((x / n) >> 0) / n ) >> 0) + w2 ) % n;
                    words.push(Mnemonic.words[w1]);
                    words.push(Mnemonic.words[w2]);
                    words.push(Mnemonic.words[w3]);
                }
                return words;
            };

            Mnemonic.fromWords = function (words) {
                var i = 0,
                    n = Mnemonic.wc,
                    l = words.length / 3,
                    seed = new Uint32Array(l),
                    w1, w2, w3;

                for (; i < l; i++) {
                    w1 = Mnemonic.words.indexOf(words[3 * i]);
                    w2 = Mnemonic.words.indexOf(words[3 * i + 1]);
                    w3 = Mnemonic.words.indexOf(words[3 * i + 2]);
                    seed[i] = w1 + n * Mnemonic._mod(w2 - w1, n) + n * n * Mnemonic._mod(w3 - w2, n);
                }

                return new Mnemonic(seed);
            };

            Mnemonic.fromHex = function (hex) {
                var hexParts = hex.match(/.{1,8}/g),
                    i = 0,
                    l = hex.length / 8,
                    seed = new Uint32Array(l),
                    x;

                for (; i < l; i++) {
                    x = parseInt(hexParts[i], 16);
                    seed[i] = x;
                }
                return new Mnemonic(seed);
            };

            Mnemonic.wc = 1626;
            //Wordlist of BIP39, because other contained words like "quick" and "quickly"
            Mnemonic.words = JSON.parse('["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel","base","basic","basket","battle","beach","bean","beauty","because","become","beef","before","begin","behave","behind","believe","below","belt","bench","benefit","best","betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood","blossom","blouse","blue","blur","blush","board","boat","body","boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm","camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","chat","cheap","check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice","choose","chronic","chuckle","chunk","churn","cigar","cinnamon","circle","citizen","city","civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","come","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool","copper","copy","coral","core","corn","correct","cost","cotton","couch","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater","crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crunch","crush","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash","daughter","dawn","day","deal","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","else","embark","embody","embrace","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","era","erase","erode","erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence","evil","evoke","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire","explain","expose","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm","fashion","fat","fatal","father","fatigue","fault","favorite","feature","february","federal","fee","feed","feel","female","fence","festival","fetch","fever","few","fiber","fiction","field","figure","file","film","filter","final","find","fine","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","flag","flame","flash","flat","flavor","flee","flight","flip","float","flock","floor","flower","fluid","flush","fly","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap","garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge","gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","girl","give","glad","glance","glare","glass","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose","gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape","grass","gravity","great","green","grid","grief","grit","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair","half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat","have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello","helmet","help","hen","hero","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub","huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt","husband","hybrid","ice","icon","idea","identify","idle","ignore","ill","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","inch","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","injury","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","iron","island","isolate","issue","item","ivory","jacket","jaguar","jar","jazz","jealous","jeans","jelly","jewel","job","join","joke","journey","joy","judge","juice","jump","jungle","junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid","kidney","kind","kingdom","kiss","kit","kitchen","kite","kitten","kiwi","knee","knife","knock","know","lab","label","labor","ladder","lady","lake","lamp","language","laptop","large","later","latin","laugh","laundry","lava","law","lawn","lawsuit","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","life","lift","light","like","limb","limit","link","lion","liquid","list","little","live","lizard","load","loan","lobster","local","lock","logic","lonely","long","loop","lottery","loud","lounge","love","loyal","lucky","luggage","lumber","lunar","lunch","luxury","lyrics","machine","mad","magic","magnet","maid","mail","main","major","make","mammal","man","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","marriage","mask","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","meat","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merry","mesh","message","metal","method","middle","midnight","milk","million","mimic","mind","minimum","minor","minute","miracle","mirror","misery","miss","mistake","mix","mixed","mixture","mobile","model","modify","mom","moment","monitor","monkey","monster","month","moon","moral","more","morning","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mule","multiply","muscle","museum","mushroom","music","must","mutual","myself","mystery","myth","naive","name","napkin","narrow","nasty","nation","nature","near","neck","need","negative","neglect","neither","nephew","nerve","nest","net","network","neutral","never","news","next","nice","night","noble","noise","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","oak","obey","object","oblige","obscure","observe","obtain","obvious","occur","ocean","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","one","onion","online","only","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pair","palace","palm","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peace","peanut","pear","peasant","pelican","pen","penalty","pencil","people","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pig","pigeon","pill","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","poverty","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quit","quiz","quote","rabbit","raccoon","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","right","rigid","ring","riot","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","rough","round","route","royal","rubber","rude","rug","rule","run","runway","rural","sad","saddle","sadness","safe","sail","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","scare","scatter","scene","scheme","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","sea","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","shell","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","shop","short","shoulder","shove","shrimp","shrug","shuffle","shy","sibling","sick","side","siege","sight","sign","silent","silk","silly","silver","similar","simple","since","sing","siren","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","skull","slab","slam","sleep","slender","slice","slide","slight","slim","slogan","slot","slow","slush","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sorry","sort","soul","sound","soup","source","south","space","spare","spatial","spawn","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","split","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","such","sudden","suffer","sugar","suggest","suit","summer","sun","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","swear","sweet","swift","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","tail","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","that","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","toe","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","top","topic","topple","torch","tornado","tortoise","toss","total","tourist","toward","tower","town","toy","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","true","truly","trumpet","trust","truth","try","tube","tuition","tumble","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","ugly","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","van","vanish","vapor","various","vast","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","vote","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","way","wealth","weapon","wear","weasel","weather","web","wedding","weekend","weird","welcome","west","wet","whale","what","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","word","work","world","worry","worth","wrap","wreck","wrestle","wrist","write","wrong","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"]');

            // make modulo arithmetic work as in math, not as in javascript ;)
            Mnemonic._mod = function (a, b) {
                return a - Math.floor(a / b) * b;
            };

            return Mnemonic;
        }();

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#words_to_hex
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Words to hex converter
         *
         * @param {array} words Array of words to convert to hex
         *
         * @returns {string} Returns hex representation
         */
        var words_to_hex = function(words) {
            return Mnemonic.fromWords(words).toHex();
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#hex_to_words
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Hex to words converter, only supports hex representations of binaries which are multiples of 32 bits
         *
         * @param {string} val Hex representation of the binary one wants to convert
         *
         * @returns {array} Returns the array of words
         */
        var hex_to_words = function(val) {
            // Mnemonic.fromHex("0a6deb990a3db22d6ed3010b").toWords()
            return Mnemonic.fromHex(val).toWords();
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#generate_authkey
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * takes the sha512 of lowercase username as salt to generate scrypt password hash in hex called
         * the authkey, so basically:
         *
         * hex(scrypt(password, hex(sha512(lower(username)))))
         *
         * For compatibility reasons with other clients please use the following parameters if you create your own client:
         *
         * var c = 16384 // 2^14;
         * var r = 8;
         * var p = 1;
         * var l = 64;
         *
         * @param {string} username Username of the user (in email format)
         * @param {string} password Password of the user
         *
         * @returns {string} auth_key Scrypt hex value of the password with the sha512 of lowercase email as salt
         */
        var generate_authkey = function (username, password) {

            var u = 14; //2^14 = 16MB
            var r = 8;
            var p = 1;
            var l = 64; // 64 Bytes = 512 Bits

            // takes the sha512(username) as salt.
            // var salt = nacl.to_hex(nacl.crypto_hash_string(username.toLowerCase()));
            var salt = sha512(username.toLowerCase());

            return to_hex(nacl.scrypt(encode_utf8(password), encode_utf8(salt), u, r, p, l, function(pDone) {}));
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#generate_secret_key
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * generates secret keys that is 32 Bytes or 256 Bits long and represented as hex
         *
         * @returns {string} Returns secret key (hex encoded, 32 byte long)
         */
        var generate_secret_key = function () {

            return to_hex(randomBytes(32)); // 32 Bytes = 256 Bits
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#generate_public_private_keypair
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * generates public and private key pair
         * All keys are 32 Bytes or 256 Bits long and represented as hex
         *
         * @returns {PublicPrivateKeyPair} Returns object with a public-private-key-pair
         */
        var generate_public_private_keypair = function () {

            var sk = randomBytes(32);
            var pk = nacl.box.generate_pubkey(sk);

            return {
                public_key : to_hex(pk), // 32 Bytes = 256 Bits
                private_key : to_hex(sk) // 32 Bytes = 256 Bits
            };
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#encrypt_secret
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Takes the secret and encrypts that with the provided password. The crypto_box takes only 256 bits, therefore we
         * are using sha256(password+user_sauce) as key for encryption.
         * Returns the nonce and the cipher text as hex.
         *
         * @param {string} secret The secret you want to encrypt
         * @param {string} password The password you want to use to encrypt the secret
         * @param {string} user_sauce The user's sauce
         *
         * @returns {EncryptedValue} The encrypted text and the nonce
         */
        var encrypt_secret = function (secret, password, user_sauce) {

            // Lets first generate our key from our user_sauce and password
            var u = 14; //2^14 = 16MB
            var r = 8;
            var p = 1;
            var l = 64; // 64 Bytes = 512 Bits

            var salt = sha512(user_sauce);

            var k = from_hex(sha256(to_hex(nacl.scrypt(encode_utf8(password), encode_utf8(salt), u, r, p, l, function(pDone) {})))); // key

            // and now lets encrypt
            var m = encode_utf8(secret); // message
            var n = randomBytes(24); // nonce
            var c = nacl.secret_box.pack(m, n, k); //encrypted message

            return {
                nonce: to_hex(n),
                text: to_hex(c)
            };

        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#decrypt_secret
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Takes the cipher text and decrypts that with the nonce and the sha256(password+user_sauce).
         * Returns the initial secret.
         *
         * @param {string} text The encrypted text
         * @param {string} nonce The nonce for the encrypted text
         * @param {string} password The password to decrypt the text
         * @param {string} user_sauce The users sauce used during encryption
         *
         * @returns {string} secret The decrypted secret
         */
        var decrypt_secret = function (text, nonce, password, user_sauce) {

            // Lets first generate our key from our user_sauce and password
            var u = 14; //2^14 = 16MB
            var r = 8;
            var p = 1;
            var l = 64; // 64 Bytes = 512 Bits

            var salt = sha512(user_sauce);

            var k = from_hex(sha256(to_hex(nacl.scrypt(encode_utf8(password), encode_utf8(salt), u, r, p, l, function(pDone) {})))); // key

            // and now lets decrypt
            var n = from_hex(nonce);
            var c = from_hex(text);
            var m1 = nacl.secret_box.open(c, n, k);

            return decode_utf8(m1);
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#encrypt_data
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Takes the data and the secret_key as hex and encrypts the data.
         * Returns the nonce and the cipher text as hex.
         *
         * @param {string} data The data you want to encrypt
         * @param {string} secret_key The secret key you want to use to encrypt the data
         *
         * @returns {EncryptedValue} The encrypted text and the nonce
         */
        var encrypt_data = function (data, secret_key) {

            var k = from_hex(secret_key);
            var m = encode_utf8(data);
            var n = randomBytes(24);
            var c = nacl.secret_box.pack(m, n, k);

            return {
                nonce: to_hex(n),
                text: to_hex(c)
            };
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#decrypt_data
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Takes the cipher text and decrypts that with the nonce and the secret_key.
         * Returns the initial data.
         *
         * @param {string} text The encrypted text
         * @param {string} nonce The nonce of the encrypted text
         * @param {string} secret_key The secret key used in the past to encrypt the text
         *
         * @returns {string} The decrypted data
         */
        var decrypt_data = function (text, nonce, secret_key) {

            var k = from_hex(secret_key);
            var n = from_hex(nonce);
            var c = from_hex(text);
            var m1 = nacl.secret_box.open(c, n, k);

            return decode_utf8(m1);
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#encrypt_data_public_key
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Takes the data and encrypts that with a random nonce, the receivers public key and users private key.
         * Returns the nonce and the cipher text as hex.
         *
         * @param {string} data The data you want to encrypt
         * @param {string} public_key The public key you want to use for the encryption
         * @param {string} private_key The private key you want to use for the encryption
         *
         * @returns {EncryptedValue} The encrypted text and the nonce
         */
        var encrypt_data_public_key = function (data, public_key, private_key) {

            var p = from_hex(public_key);
            var s = from_hex(private_key);
            var m = encode_utf8(data);
            var n = randomBytes(24);
            var c = nacl.box.pack(m, n, p, s);

            return {
                nonce: to_hex(n),
                text: to_hex(c)
            };
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#decrypt_data_public_key
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Takes the cipher text and decrypts that with the nonce, the senders public key and users private key.
         * Returns the initial data.
         *
         * @param {string} text The encrypted text
         * @param {string} nonce The nonce that belongs to the encrypted text
         * @param {string} public_key The pulic key you want to use to decrypt the text
         * @param {string} private_key The private key you want to use to encrypt the text
         *
         * @returns {string} The decrypted data
         */
        var decrypt_data_public_key = function (text, nonce, public_key, private_key) {

            var p = from_hex(public_key);
            var s = from_hex(private_key);
            var n = from_hex(nonce);
            var c = from_hex(text);
            var m1 = nacl.box.open(c, n, p, s);

            return decode_utf8(m1);
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#generate_user_sauce
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * returns a 32 bytes long random hex value to be used as the user special sauce
         *
         * @returns {string} Returns a random user sauce (32 bytes, hex encoded)
         */
        var generate_user_sauce = function() {

            return to_hex(randomBytes(32)); // 32 Bytes = 256 Bits
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#get_checksum
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * generates a n-long base58 checksum
         *
         * @param {string} str The string of which ones to have a checksum
         * @param {int} n The length of the checksum one wants to have
         *
         * @returns {string} Returns n base58 encoded chars as checksum
         */
        var get_checksum = function(str, n) {
            return hex_to_base58(sha512(str)).substring(0, n);
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#generate_recovery_code
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * returns a 16 bytes long random base58 value to be used as recovery password including four base58 letters as checksum
         *
         * @returns {object} Returns a random user sauce (16 bytes, hex encoded)
         */
        var generate_recovery_code = function() {
            var password_bytes = randomBytes(16);// 16 Bytes = 128 Bits
            var password_hex = to_hex(password_bytes);
            var password_words = hex_to_words(password_hex);
            var password_base58 = to_base58(password_bytes);

            // Then we split up everything in 11 digits long chunks
            var recovery_code_chunks = helper.split_string_in_chunks(password_base58, 11);
            // Then we loop over our chunks and use the base58 representation of the sha512 checksum to get 2 checksum
            // digits, and append them to the original chunk
            for (var i = 0; i < recovery_code_chunks.length; i++) {
                recovery_code_chunks[i] += get_checksum(recovery_code_chunks[i], 2);
            }

            return {
                bytes: password_bytes,
                hex: password_hex,
                words: password_words,
                base58: password_base58,
                base58_checksums: recovery_code_chunks.join('')
            };
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#recovery_code_strip_checksums
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Removes the checksums from a base58 encoded recovery code with checksums.
         * e.g. 'UaKSKNNixJY2ARqGDKXduo4c2N' becomes 'UaKSKNNixJYRqGDKXduo4c'
         *
         * @param {string} recovery_code_with_checksums The recovery code with checksums
         *
         * @returns {string} Returns recovery code without checksums
         */
        var recovery_code_strip_checksums = function(recovery_code_with_checksums) {

            var recovery_code_chunks = helper.split_string_in_chunks(recovery_code_with_checksums, 13);

            for (var i = 0; i < recovery_code_chunks.length; i++) {

                if (recovery_code_chunks[i].length < 2) {
                    throw new InvalidRecoveryCodeException("Recovery code chunks with a size < 2 are impossible");
                }
                recovery_code_chunks[i] = recovery_code_chunks[i].slice(0,-2);
            }
            return recovery_code_chunks.join('')
        };

        /**
         * @ngdoc
         * @name psonocli.cryptoLibrary#recovery_password_chunk_pass_checksum
         * @methodOf psonocli.cryptoLibrary
         *
         * @description
         * Tests if a given recovery password chunk can be valid according to the checksum
         * e.g. UaKSKNNixJY2A would return true and UaKSKNNixJY2B would return false
         *
         * @returns {boolean} Returns weather the password chunk is valid
         */
        var recovery_password_chunk_pass_checksum = function(chunk_with_checksum) {
            var password = chunk_with_checksum.substring(0, chunk_with_checksum.length -2);
            var checksum = chunk_with_checksum.substring(chunk_with_checksum.length -2);
            return get_checksum(password, 2) === checksum;
        };


        return {
            // Conversion functions
            to_hex: to_hex,
            from_hex: from_hex,
            to_base58: to_base58,
            from_base58: from_base58,
            hex_to_base58: hex_to_base58,
            base58_to_hex: base58_to_hex,
            uuid_to_hex: uuid_to_hex,
            hex_to_uuid: hex_to_uuid,
            words_to_hex: words_to_hex,
            hex_to_words: hex_to_words,

            // crypto functions
            randomBytes: randomBytes,
            sha256: sha256,
            sha512: sha512,


            generate_authkey: generate_authkey,
            generate_secret_key: generate_secret_key,
            generate_public_private_keypair: generate_public_private_keypair,
            encrypt_secret: encrypt_secret,
            decrypt_secret: decrypt_secret,
            encrypt_data: encrypt_data,
            decrypt_data: decrypt_data,
            encrypt_data_public_key: encrypt_data_public_key,
            decrypt_data_public_key: decrypt_data_public_key,
            generate_user_sauce: generate_user_sauce,
            get_checksum: get_checksum,
            generate_recovery_code: generate_recovery_code,
            recovery_code_strip_checksums: recovery_code_strip_checksums,
            recovery_password_chunk_pass_checksum: recovery_password_chunk_pass_checksum
        };
    };

    var app = angular.module('psonocli');
    app.factory("cryptoLibrary", ['helper', cryptoLibrary]);

}(angular, require, sha512, sha256, uuid));

