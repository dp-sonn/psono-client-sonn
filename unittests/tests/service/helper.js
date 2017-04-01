(function () {
    describe('Service: helper test suite', function () {

        beforeEach(module('psonocli'));

        it('helper exists', inject(function (helper) {
            expect(helper).toBeDefined();
        }));


        it('parse_url www domain', inject(function (helper) {
            expect(helper.parse_url('https://www.example.com/url-part/#is-not-part')).toEqual({
                scheme: 'https',
                authority: 'example.com',
                full_domain: 'example.com',
                top_domain: 'example.com',
                port: null,
                path: '/url-part/',
                query: undefined,
                fragment: 'is-not-part'
            });
        }));

        it('parse_url top lvl domain', inject(function (helper) {
            expect(helper.parse_url('https://example.com/url-part/#is-not-part')).toEqual({
                scheme: 'https',
                authority: 'example.com',
                full_domain: 'example.com',
                top_domain: 'example.com',
                port: null, path: '/url-part/',
                query: undefined,
                fragment: 'is-not-part'
            });
        }));

        it('parse_url sub domain', inject(function (helper) {
            expect(helper.parse_url('http://test.example.com/url-part/#is-not-part')).toEqual({
                scheme: 'http',
                authority: 'test.example.com',
                full_domain: 'test.example.com',
                top_domain: 'example.com',
                port: null,
                path: '/url-part/',
                query: undefined,
                fragment: 'is-not-part'
            });
        }));

        it('parse_url sub domain', inject(function (helper) {
            expect(helper.parse_url('http://test.example.com:6000/url-part/#is-not-part')).toEqual({
                scheme: 'http',
                authority: 'test.example.com:6000',
                full_domain: 'test.example.com',
                top_domain: 'example.com',
                port: '6000',
                path: '/url-part/',
                query: undefined,
                fragment: 'is-not-part'
            });
        }));

        it('get_domain sub domain', inject(function (helper) {
            expect(helper.get_domain('http://test.example.com/url-part/#is-not-part')).toEqual('test.example.com');
        }));

        it('get_domain www domain', inject(function (helper) {
            expect(helper.get_domain('http://www.example.com/url-part/#is-not-part')).toEqual('example.com');
        }));

        it('get_domain top level domain', inject(function (helper) {
            expect(helper.get_domain('http://example.com/url-part/#is-not-part')).toEqual('example.com');
        }));

        it('array_starts_with a no array', inject(function (helper) {
            expect(helper.array_starts_with('a', ['a'])).toBeFalsy();
        }));

        it('array_starts_with b no array', inject(function (helper) {
            expect(helper.array_starts_with(['a'], 'a')).toBeFalsy();
        }));

        it('array_starts_with a.length < b.lenght', inject(function (helper) {
            expect(helper.array_starts_with(['a'], ['a', 'b'])).toBeFalsy();
        }));

        it('array_starts_with a = b', inject(function (helper) {
            expect(helper.array_starts_with(['a', 'b'], ['a', 'b'])).toBeTruthy();
        }));


        it('array_starts_with a != b', inject(function (helper) {
            expect(helper.array_starts_with(['a', 'b'], ['a', 'c'])).toBeFalsy();
        }));

        it('array_starts_with a starts with b', inject(function (helper) {
            expect(helper.array_starts_with(['a', 'b', 'c'], ['a', 'b'])).toBeTruthy();
        }));

        it('create_list', inject(function (helper) {

            var list = [];

            helper.create_list({
                'items': ['a', 'b'],
                'folders': [
                    {
                        'items': ['c', 'd']
                        // no folders
                    },
                    {
                        // two folder parallel
                        'items': ['e', 'f'],
                        'folders': [
                            {
                                // at least two folder level handled
                                'items': ['g', 'h'],
                                'folders': [
                                    // empty folders
                                ]
                            }
                        ]
                    }
                ]
            }, list);

            expect(list).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        }));

        it('duplicate_object', inject(function (helper) {

            var orig_obj = {
                'a': ['b'],
                'c': true
            };

            var dubl_obj = helper.duplicate_object(orig_obj);

            expect(orig_obj).toEqual(dubl_obj);
            dubl_obj.c = false;
            expect(orig_obj).not.toEqual(dubl_obj);
        }));

        it('is_valid_username not allowed chars', inject(function (helper) {
            expect(helper.is_valid_username('ab@cd') === true).not.toBeTruthy();
        }));

        it('is_valid_username too small', inject(function (helper) {
            expect(helper.is_valid_username('ab') === true).not.toBeTruthy();
        }));

        it('is_valid_username start with .', inject(function (helper) {
            expect(helper.is_valid_username('.abcd') === true).not.toBeTruthy();
        }));

        it('is_valid_username start with -', inject(function (helper) {
            expect(helper.is_valid_username('-abcd') === true).not.toBeTruthy();
        }));

        it('is_valid_username end with .', inject(function (helper) {
            expect(helper.is_valid_username('abcd.') === true).not.toBeTruthy();
        }));

        it('is_valid_username end with -', inject(function (helper) {
            expect(helper.is_valid_username('abcd-') === true).not.toBeTruthy();
        }));

        it('is_valid_username double occurrence of .', inject(function (helper) {
            expect(helper.is_valid_username('abc..def') === true).not.toBeTruthy();
        }));

        it('is_valid_username double occurrence of -', inject(function (helper) {
            expect(helper.is_valid_username('abc--def') === true).not.toBeTruthy();
        }));

        it('is_valid_username occurrence of .-', inject(function (helper) {
            expect(helper.is_valid_username('abc.-def') === true).not.toBeTruthy();
        }));

        it('is_valid_username occurrence of -.', inject(function (helper) {
            expect(helper.is_valid_username('abc-.def') === true).not.toBeTruthy();
        }));

        it('is_valid_username valid', inject(function (helper) {
            expect(helper.is_valid_username('abc') === true).toBeTruthy();
        }));

    });

}).call();
