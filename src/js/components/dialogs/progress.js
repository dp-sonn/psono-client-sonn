import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Grid } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";


const DialogProgress = (props) => {
    const { open, percentageComplete } = props;
    const { t } = useTranslation();

    return (
        <Dialog
            fullWidth
            maxWidth={"sm"}
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{t("OPERATION_IN_PROGRESS")}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <MuiAlert
                            severity="info"
                            style={{
                                marginBottom: "5px",
                                marginTop: "5px",
                            }}
                        >
                            {t("OPERATION_IN_PROGRESS_PLEASE_WAIT")}
                        </MuiAlert>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} style={{ marginBottom: "8px", marginTop: "8px" }}>
                        <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                                <LinearProgress variant="determinate" value={percentageComplete} />
                            </Box>
                            <Box minWidth={35}>
                                <span style={{ color: "white", whiteSpace: "nowrap" }}>{percentageComplete} %</span>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

DialogProgress.propTypes = {
    open: PropTypes.bool.isRequired,
    percentageComplete: PropTypes.number.isRequired,
};

export default DialogProgress;
