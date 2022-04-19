import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import browserClient from "../../services/browser-client";
import helperService from "../../services/helper";
import user from "../../services/user";
import converterService from "../../services/converter";
import host from "../../services/host";
import cryptoLibrary from "../../services/crypto-library";
import GridContainerErrors from "../../components/grid-container-errors";
import MuiAlert from "@material-ui/lab/Alert";
import action from "../../actions/bound-action-creators";
import store from "../../services/store";

const styles = (theme) => ({
    textField: {
        width: "100%",
        "& .MuiInputBase-root": {
            color: "#b1b6c1",
        },
        "& .MuiInputAdornment-root .MuiTypography-colorTextSecondary": {
            color: "#666",
        },
        "& MuiFormControl-root": {
            color: "#b1b6c1",
        },
        "& label": {
            color: "#b1b6c1",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#666",
            },
        },
    },
    disabledButton: {
        backgroundColor: "rgba(45, 187, 147, 0.50) !important",
    },
    button: {
        color: "white !important",
    },
});

const EmergencyCodeViewForm = (props) => {
    const { classes } = props;
    const { t } = useTranslation();

    const [view, setView] = useState("default");
    const [remainingWaitingTime, setRemainingWaitingTime] = useState(-1);
    const [username, setUsername] = useState("");
    const [emergencyCode, setEmergencyCode] = useState("");
    const [code1, setCode1] = useState("");
    const [code2, setCode2] = useState("");
    const [words, setWords] = useState("");
    const [server, setServer] = useState(store.getState().server.url);
    const [serverCheck, setServerCheck] = useState({});
    const [domain, setDomain] = useState("");
    const [errors, setErrors] = useState([]);
    const [allowCustomServer, setAllowCustomServer] = useState(true);

    React.useEffect(() => {
        browserClient.getConfig().then(onNewConfigLoaded);
    }, []);

    const cancel = (e) => {
        setView("default");
        setErrors([]);
    };

    const onNewConfigLoaded = (configJson) => {
        const serverUrl = configJson["backend_servers"][0]["url"];
        const domain = configJson["backend_servers"][0]["domain"];
        const allowCustomServer = configJson.allow_custom_server;

        setServer(serverUrl);
        setDomain(domain);
        setAllowCustomServer(allowCustomServer);
    };

    const arm = (localEmergencyCode) => {
        let parsedUrl = helperService.parseUrl(server);
        let fullUsername = helperService.formFullUsername(username, domain || parsedUrl["full_domain"]);

        function onError(data) {
            setView("default");
            console.log(data);
            if (data.hasOwnProperty("data") && data.data.hasOwnProperty("non_field_errors")) {
                setErrors(data.data.non_field_errors);
            } else if (data.hasOwnProperty("data") && data.data.hasOwnProperty("detail")) {
                setErrors([data.data.detail]);
            } else if (!data.hasOwnProperty("data")) {
                setErrors(["SERVER_OFFLINE"]);
            } else {
                alert("Error, should not happen.");
            }
        }

        function onSuccess(data) {
            if (data.status === "active") {
                window.location.href = "index.html";
            }

            setView(data.status); // started, waiting
            if (data.remaining_wait_time) {
                setRemainingWaitingTime(data.remaining_wait_time);
            }
        }
        user.armEmergencyCode(
            fullUsername,
            localEmergencyCode,
            server,
            serverCheck["info"],
            serverCheck["verify_key"]
        ).then(onSuccess, onError);
    };

    const approveHost = () => {
        host.approveHost(serverCheck.server_url, serverCheck.verify_key);
        arm(emergencyCode);
    };

    const approveNewServer = () => {
        return approveHost();
    };

    const disapproveNewServer = () => {
        setView("default");
        setErrors([]);
    };

    const armEmergencyCode = () => {
        setErrors([]);
        action.setServerUrl(server);

        let parsedUrl = helperService.parseUrl(server);
        let fullUsername = helperService.formFullUsername(username, domain || parsedUrl["full_domain"]);
        const test_result = helperService.isValidUsername(fullUsername);
        if (test_result) {
            setErrors([test_result]);
            return;
        }

        // Validate now the recovery code information (words and codes)
        let localEmergencyCode;
        if (typeof words !== "undefined" && words !== "") {
            localEmergencyCode = converterService.hexToBase58(converterService.wordsToHex(words.split(" ")));
        } else if (typeof code1 !== "undefined" && code1 !== "" && typeof code2 !== "undefined" && code2 !== "") {
            if (
                !cryptoLibrary.recoveryPasswordChunkPassChecksum(code1) ||
                !cryptoLibrary.recoveryPasswordChunkPassChecksum(code2)
            ) {
                setErrors(["AT_LEAST_ONE_CODE_INCORRECT"]);
                return;
            }
            localEmergencyCode = cryptoLibrary.recoveryCodeStripChecksums(code1 + code2);
        } else {
            setErrors(["SOMETHING_STRANGE_HAPPENED"]);
            return;
        }

        setEmergencyCode(localEmergencyCode);

        const onError = function () {
            setErrors(["SERVER_OFFLINE"]);
        };

        const onSuccess = function (serverCheck) {
            setServerCheck(serverCheck);
            action.setServerInfo(serverCheck.info, serverCheck.verify_key);
            console.log(serverCheck.status);
            if (serverCheck.status !== "matched") {
                setView(serverCheck.status);
                return;
            }

            arm(localEmergencyCode);
        };
        host.checkHost(server).then(onSuccess, onError);
    };

    let formContent;

    if (view === "default") {
        formContent = (
            <>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            margin="dense"
                            id="username"
                            label={t("USERNAME")}
                            InputProps={{
                                endAdornment:
                                    domain && !username.includes("@") ? (
                                        <InputAdornment position="end">{"@" + domain}</InputAdornment>
                                    ) : null,
                            }}
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            margin="dense"
                            id="code1"
                            placeholder="DdSLuiDcPuY2F"
                            name="code1"
                            autoComplete="code1"
                            value={code1}
                            onChange={(event) => {
                                setCode1(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            margin="dense"
                            id="code2"
                            placeholder="Dsxf82sKQdqPs"
                            name="code2"
                            autoComplete="code2"
                            value={code2}
                            onChange={(event) => {
                                setCode2(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            margin="dense"
                            id="words"
                            placeholder={t("OR_WORDLIST")}
                            name="words"
                            autoComplete="words"
                            value={words}
                            onChange={(event) => {
                                setWords(event.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} sm={6} md={6} style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            classes={{ disabled: classes.disabledButton }}
                            onClick={armEmergencyCode}
                            type="submit"
                            disabled={(!words && (!code1 || !code2)) || !username}
                        >
                            {t("ACTIVATE_EMERGENCY_CODE")}
                        </Button>
                    </Grid>
                </Grid>
                <GridContainerErrors errors={errors} setErrors={setErrors} />
                {allowCustomServer && (
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                className={classes.textField}
                                variant="outlined"
                                margin="dense"
                                id="server"
                                label={t("SERVER")}
                                name="server"
                                autoComplete="server"
                                value={server}
                                onChange={(event) => {
                                    setServer(event.target.value);
                                    setDomain(helperService.getDomain(event.target.value));
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
            </>
        );
    }

    if (view === "started") {
        formContent = (
            <>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <MuiAlert
                            onClose={() => {
                                setErrors([]);
                            }}
                            severity="success"
                            style={{ marginBottom: "5px" }}
                        >
                            {t("EMERGENCY_CODE_ACTIVATED")} {remainingWaitingTime} {t("SECONDS")}
                        </MuiAlert>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            href={"index.html"}
                            className={classes.button}
                        >
                            {t("BACK_TO_HOME")}
                        </Button>
                    </Grid>
                </Grid>
            </>
        );
    }

    if (view === "waiting") {
        formContent = (
            <>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <MuiAlert
                            onClose={() => {
                                setErrors([]);
                            }}
                            severity="success"
                            style={{ marginBottom: "5px" }}
                        >
                            {t("EMERGENCY_CODE_WAITING")} {remainingWaitingTime} {t("SECONDS")}
                        </MuiAlert>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            href={"index.html"}
                            className={classes.button}
                        >
                            {t("BACK_TO_HOME")}
                        </Button>
                    </Grid>
                </Grid>
            </>
        );
    }

    if (view === "new_server") {
        formContent = (
            <>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <h4>{t("NEW_SERVER")}</h4>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            margin="dense"
                            id="server_fingerprint"
                            label={t("FINGERPRINT_OF_THE_NEW_SERVER")}
                            InputProps={{
                                multiline: true,
                            }}
                            name="server_fingerprint"
                            autoComplete="server_fingerprint"
                            value={serverCheck.verify_key}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <MuiAlert
                            severity="info"
                            style={{
                                marginBottom: "5px",
                                marginTop: "5px",
                            }}
                        >
                            {t("IT_APPEARS_THAT_YOU_WANT_TO_CONNECT")}
                        </MuiAlert>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={approveHost}
                            type="submit"
                            style={{ marginRight: "10px" }}
                        >
                            {t("APPROVE")}
                        </Button>
                        <Button variant="contained" onClick={cancel}>
                            {t("CANCEL")}
                        </Button>
                    </Grid>
                </Grid>
                <GridContainerErrors errors={errors} setErrors={setErrors} />
            </>
        );
    }

    if (view === "signature_changed") {
        formContent = (
            <>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <h4>{t("SERVER_SIGNATURE_CHANGED")}</h4>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            margin="dense"
                            id="server_fingerprint"
                            label={t("FINGERPRINT_OF_THE_NEW_SERVER")}
                            InputProps={{
                                multiline: true,
                            }}
                            name="server_fingerprint"
                            autoComplete="server_fingerprint"
                            value={serverCheck.verify_key}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            margin="dense"
                            id="oldserver_fingerprint"
                            label={t("FINGERPRINT_OF_THE_OLD_SERVER")}
                            InputProps={{
                                multiline: true,
                            }}
                            name="oldserver_fingerprint"
                            autoComplete="oldserver_fingerprint"
                            value={serverCheck.verify_key_old}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <MuiAlert
                            severity="warning"
                            style={{
                                marginBottom: "5px",
                                marginTop: "5px",
                            }}
                        >
                            {t("THE_SIGNATURE_OF_THE_SERVER_CHANGED")}
                            <br />
                            <br />
                            <strong>{t("CONTACT_THE_OWNER_OF_THE_SERVER")}</strong>
                        </MuiAlert>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={disapproveNewServer}
                            type="submit"
                            style={{ marginRight: "10px" }}
                        >
                            {t("CANCEL")}
                        </Button>
                        <Button variant="contained" onClick={approveNewServer}>
                            {t("IGNORE_AND_CONTINUE")}
                        </Button>
                    </Grid>
                </Grid>
                <GridContainerErrors errors={errors} setErrors={setErrors} />
            </>
        );
    }

    if (view === "success") {
        formContent = (
            <>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
                        <ThumbUpIcon style={{ fontSize: 160 }} />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            href={"index.html"}
                            className={classes.button}
                        >
                            {t("BACK_TO_HOME")}
                        </Button>
                    </Grid>
                </Grid>
            </>
        );
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            name="lostpasswordForm"
            autoComplete="off"
        >
            {formContent}
            <div className="box-footer">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        browserClient.openTab("privacy-policy.html");
                    }}
                >
                    {t("PRIVACY_POLICY")}
                </a>
            </div>
        </form>
    );
};

export default withStyles(styles)(EmergencyCodeViewForm);
