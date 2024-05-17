import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Divider from "@material-ui/core/Divider";
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

import GridContainerErrors from "../grid-container-errors";
import accountService from "../../services/account";
import {getStore} from "../../services/store";
import avatarService from "../../services/avatar";

const useStyles = makeStyles((theme) => ({
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        '&:hover': {
            cursor: 'pointer', // This makes the cursor a pointer on hover
            backgroundColor: theme.palette.action.hover, // Optional: adds a hover effect for better UX
        },
    },
    activeAccount: {
        backgroundColor: theme.palette.action.selected,
        '&:hover': {
            cursor: 'default', // Keeps the cursor as default on the active account
        },
    },
    logoutButton: {
        color: theme.palette.secondary.main,
    },
    addButton: {
        justifyContent: 'center',
    }
}));

const DialogChangeAccount = ({ open, onClose, allowNewAccounts }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const [accounts, setAccounts] = useState([]);
    const [errors, setErrors] = useState([]);


    let isSubscribed = true;
    React.useEffect(() => {
        loadAccounts();
        return () => (isSubscribed = false);
    }, []);

    const loadAccounts = async () => {

        await accountService.updateInfoCurrent({
            'username': getStore().getState().user.username,
            'isLoggedIn': getStore().getState().user.isLoggedIn,
            'server': getStore().getState().server.url,
            'avatar': await avatarService.readAvatarCached() || '',
        });

        const accounts = await accountService.listAccounts();
        setAccounts(accounts);
    };

    const handleLogout = async (account) => {
        await accountService.logout(account.id);
        await loadAccounts();
    };
    const handleAddAccount = async () => {
        await accountService.addAccount();
    };
    const handleSwitchAccount = async (account) => {
        if (account.active) {
            return;
        }
        await accountService.updateCurrentId(account.id);
    };

    return (
        <Dialog
            fullWidth
            maxWidth={"sm"}
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{t("CHANGE_ACCOUNT")}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <List className={classes.list}>
                            {accounts.map((account, index) => (
                                <React.Fragment key={index}>
                                    <ListItem
                                        className={`${classes.listItem} ${account.active ? classes.activeAccount : ''}`}
                                        onClick={() => handleSwitchAccount(account)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={account.info.avatar || ""}>
                                                {!account.info.avatar && account.info.username[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={account.info.isLoggedIn ? account.info.username : t('LOGIN_PENDING')} secondary={account.info.server} />
                                        {account.info.isLoggedIn && !account.active && <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                className={classes.logoutButton}
                                                onClick={() => handleLogout(account)}
                                            >
                                                <ExitToAppIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>}
                                    </ListItem>
                                    {index !== accounts.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                            {allowNewAccounts && <ListItem button className={classes.addButton} onClick={handleAddAccount}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={t("ADD_ACCOUNT")} />
                            </ListItem>}

                        </List>
                    </Grid>
                    <GridContainerErrors errors={errors} setErrors={setErrors} />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("CLOSE")}</Button>
            </DialogActions>
        </Dialog>
    );
};

DialogChangeAccount.defaultProps = {
    allowNewAccounts: true,
};

DialogChangeAccount.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    allowNewAccounts: PropTypes.bool,
};

export default DialogChangeAccount;
