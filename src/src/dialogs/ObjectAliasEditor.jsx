import React, { Component } from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    MenuList,
    ListItemIcon,
    ListItemText, TextField, Checkbox, FormControlLabel, InputAdornment, IconButton, InputLabel, Select, FormControl,
} from '@mui/material';

// Icons
import {
    Close,
    Link as IconLink,
    AddLink, Close as IconClose,
} from '@mui/icons-material';

import withWidth from '@iobroker/adapter-react-v5/Components/withWidth';

import { I18n, IconFx, Utils } from '@iobroker/adapter-react-v5';

const styles = theme => ({
    funcIcon: {
        width: 16,
        height: 16,
    },
    formControlLabel: {
        marginBottom: theme.spacing(2),
    },
    color: {
        // display: 'block',
        width: 70,
    },
    typeNameEng: {
        marginLeft: theme.spacing(1),
        opacity: 0.7,
        fontStyle: 'italic',
        fontSize: 'smaller',
    },
    usedInAlias: {
        // backgroundColor: theme.palette.secondary.main,
    },
    addNewAlias: {
        backgroundColor: theme.palette.primary.main,
    },
});
const stateTypeArray = ['array', 'boolean', 'file', 'json', 'mixed', 'number', 'object', 'string'];

// todo: icon, enum function, enum room, write from other object

class ObjectAliasEditor extends Component {
    constructor(props) {
        super(props);

        const usedInAliases = [];
        const id = this.props.obj._id;

        this.aliasIDs = Object.keys(this.props.objects).filter(_id => _id.startsWith('alias.0'));
        // Try to find, if this state used somewhere in alias
        for (let i = 0; i < this.aliasIDs.length; i++) {
            const alias = this.props.objects[this.aliasIDs[i]].common?.alias;
            if (alias?.id === id || (typeof alias?.id === 'object' && (alias.id.read === id || alias.id.write === id))) {
                usedInAliases.push(this.aliasIDs[i]);
            }
        }

        this.state = {
            usedInAliases,
            showAddNewAlias: !usedInAliases.length,
            newAliasId: this.props.obj._id,
            newAliasName: ObjectAliasEditor.getText(this.props.obj.common.name || this.props.obj._id),
            newAliasRead: this.props.obj.common.read,
            newAliasWrite: this.props.obj.common.write,
            newAliasUnit: this.props.obj.common.unit,
            newAliasDesc: ObjectAliasEditor.getText(this.props.obj.common.desc),
            newAliasType: this.props.obj.common.type,
            newAliasUseFormula: false,
            newAliasReadFormula: 'val',
            newAliasWriteFormula: 'val',
            newAliasColor: this.props.obj.common.color,
            newAliasIcon: this.props.obj.common.icon,
        };
    }

    static getText(text) {
        if (!text) {
            return '';
        }
        if (typeof text === 'object') {
            return text[I18n.getLanguage()] || text.en || '';
        }
        return text.toString();
    }

    renderAddNewAlias() {
        if (!this.state.showAddNewAlias) {
            return null;
        }
        return <Dialog
            open={!0}
            onClose={() => this.setState({ showAddNewAlias: false })}
        >
            <DialogTitle>{I18n.t('Create new alias: %s', `alias.0.${this.state.newAliasId}`)}</DialogTitle>
            <DialogContent>
                <TextField
                    className={this.props.classes.formControlLabel}
                    variant="standard"
                    value={this.state.newAliasId}
                    InputProps={{
                        endAdornment: this.state.newAliasId ? <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => this.setState({ newAliasId: '' })}
                            >
                                <IconClose />
                            </IconButton>
                        </InputAdornment> : null,
                    }}
                    onChange={e => this.setState({ newAliasId: e.target.value })}
                    label={I18n.t('Alias ID')}
                    helperText={`alias.0.${this.state.newAliasId}`}
                    fullWidth
                />
                <TextField
                    className={this.props.classes.formControlLabel}
                    variant="standard"
                    value={this.state.newAliasName}
                    InputProps={{
                        endAdornment: this.state.newAliasName ? <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => this.setState({ newAliasName: '' })}
                            >
                                <IconClose />
                            </IconButton>
                        </InputAdornment> : null,
                    }}
                    onChange={e => this.setState({ newAliasName: e.target.value })}
                    label={I18n.t('Alias name')}
                    fullWidth
                />
                <TextField
                    className={this.props.classes.formControlLabel}
                    variant="standard"
                    value={this.state.newAliasDesc}
                    InputProps={{
                        endAdornment: this.state.newAliasDesc ? <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => this.setState({ newAliasDesc: '' })}
                            >
                                <IconClose />
                            </IconButton>
                        </InputAdornment> : null,
                    }}
                    onChange={e => this.setState({ newAliasDesc: e.target.value })}
                    label={I18n.t('Alias description')}
                    fullWidth
                />
                <FormControl className={this.props.classes.formControlLabel} fullWidth>
                    <InputLabel>{I18n.t('State type')}</InputLabel>
                    <Select
                        variant="standard"
                        value={this.state.newAliasType}
                        onChange={e => this.setState({ newAliasType: e.target.value })}
                    >
                        {stateTypeArray.map(el => (
                            <MenuItem key={el} value={el}>
                                {I18n.t(el)}
                                <span className={this.props.classes.typeNameEng}>
(
                                    {el}
)
                                </span>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    className={this.props.classes.formControlLabel}
                    variant="standard"
                    value={this.state.newAliasUnit}
                    InputProps={{
                        endAdornment: this.state.newAliasUnit ? <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => this.setState({ newAliasUnit: '' })}
                            >
                                <IconClose />
                            </IconButton>
                        </InputAdornment> : null,
                    }}
                    onChange={e => this.setState({ newAliasUnit: e.target.value })}
                    label={I18n.t('Alias units')}
                    fullWidth
                />
                <TextField
                    variant="standard"
                    className={Utils.clsx(this.props.classes.formControlLabel, this.props.classes.color)}
                    label={I18n.t('Color')}
                    type="color"
                    value={this.state.newAliasColor}
                    onChange={e => this.setState({ newAliasColor: e.target.value })}
                />
                <FormControlLabel
                    className={this.props.classes.formControlLabel}
                    control={<Checkbox
                        indeterminate={this.state.newAliasRead === undefined || this.state.newAliasRead === null}
                        checked={this.state.newAliasRead}
                        onChange={e => {
                            const newState = { newAliasRead: e.target.checked };
                            // state cannot be not readable and not writeable
                            if (newState.newAliasRead === false && this.state.newAliasWrite === false) {
                                newState.newAliasWrite = true;
                            }
                            this.setState(newState);
                        }}
                    />}
                    label={I18n.t('Alias read')}
                />
                <FormControlLabel
                    className={this.props.classes.formControlLabel}
                    control={<Checkbox
                        indeterminate={this.state.newAliasWrite === undefined || this.state.newAliasWrite === null}
                        checked={this.state.newAliasWrite}
                        onChange={e => {
                            const newState = { newAliasWrite: e.target.checked };
                            // state cannot be not readable and not writeable
                            if (newState.newAliasRead === false && this.state.newAliasWrite === false) {
                                newState.newAliasRead = true;
                            }
                            this.setState(newState);
                        }}
                    />}
                    label={I18n.t('Alias write')}
                />
                <FormControlLabel
                    className={this.props.classes.formControlLabel}
                    control={<Checkbox
                        checked={this.state.newAliasUseFormula}
                        onChange={e => this.setState({ newAliasUseFormula: e.target.checked })}
                    />}
                    label={I18n.t('Use convert functions')}
                />
                {this.state.newAliasUseFormula && this.state.newAliasRead ? <TextField
                    className={this.props.classes.formControlLabel}
                    variant="standard"
                    value={this.state.newAliasReadFormula}
                    onChange={e => this.setState({ newAliasReadFormula: e.target.value })}
                    label={I18n.t('Read formula')}
                    helperText={`${I18n.t('JS function like')} "val / 5 + 21"`}
                    InputProps={{
                        endAdornment: this.state.newAliasReadFormula && this.state.newAliasReadFormula !== 'val' ? <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => this.setState({ newAliasReadFormula: 'val' })}
                            >
                                <IconClose />
                            </IconButton>
                        </InputAdornment> : null,
                        startAdornment: <InputAdornment position="start">
                            <IconFx className={this.props.classes.funcIcon} />
                        </InputAdornment>,
                    }}
                    fullWidth
                /> : null}
                {this.state.newAliasUseFormula && this.state.newAliasWrite ? <TextField
                    className={this.props.classes.formControlLabel}
                    variant="standard"
                    value={this.state.newAliasWriteFormula}
                    onChange={e => this.setState({ newAliasWriteFormula: e.target.value })}
                    label={I18n.t('Write formula')}
                    InputProps={{
                        endAdornment: this.state.newAliasWriteFormula && this.state.newAliasWriteFormula !== 'val' ? <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() => this.setState({ newAliasWriteFormula: 'val' })}
                            >
                                <IconClose />
                            </IconButton>
                        </InputAdornment> : null,
                        startAdornment: <InputAdornment position="start">
                            <IconFx className={this.props.classes.funcIcon} />
                        </InputAdornment>,
                    }}
                    helperText={`${I18n.t('JS function like')} "val / 5 + 21"`}
                    fullWidth
                /> : null}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    disabled={!this.state.newAliasId || !!this.props.objects[`alias.0.${this.state.newAliasId}`]}
                    onClick={async () => {
                        const obj = {
                            _id: `alias.0.${this.state.newAliasId}`,
                            type: 'state',
                            common: {
                                name: this.state.newAliasName,
                                type: this.props.obj.common.type,
                                alias: {
                                    id: this.props.obj._id,
                                },
                            },
                            native: {},
                        };
                        if (this.state.newAliasDesc) {
                            obj.common.desc = this.state.newAliasDesc;
                        }
                        if (this.state.newAliasType) {
                            obj.common.type = this.state.newAliasType;
                        }
                        if (this.state.newAliasUnit) {
                            obj.common.unit = this.state.newAliasUnit;
                        }
                        if (this.state.newAliasRead !== undefined && this.state.newAliasRead !== null) {
                            obj.common.read = this.state.newAliasRead;
                        }
                        if (this.state.newAliasWrite !== undefined && this.state.newAliasWrite !== null) {
                            obj.common.write = this.state.newAliasWrite;
                        }
                        if (this.state.newAliasColor) {
                            obj.common.color = this.state.newAliasColor;
                        }
                        if (this.state.newAliasIcon) {
                            obj.common.icon = this.state.newAliasIcon;
                        }
                        if (this.state.newAliasUseFormula) {
                            if (obj.common.read !== false && this.state.newAliasReadFormula && this.state.newAliasReadFormula !== 'val') {
                                obj.common.alias.read = this.state.newAliasReadFormula;
                            }
                            if (obj.common.write !== false && this.state.newAliasWriteFormula && this.state.newAliasWriteFormula !== 'val') {
                                obj.common.alias.write = this.state.newAliasWriteFormula;
                            }
                        }
                        await this.props.socket.setObject(obj._id, obj);
                        this.setState({ showAddNewAlias: false });
                        this.props.onRedirect(obj._id, 2000);
                        this.props.onClose();
                    }}
                    startIcon={<AddLink />}
                    color="primary"
                >
                    {this.props.t('Create')}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => this.setState({ showAddNewAlias: false })}
                    startIcon={<Close />}
                    color="grey"
                >
                    {this.props.t('Close')}
                </Button>
            </DialogActions>
        </Dialog>;
    }

    render() {
        return <Dialog
            key="editAlias"
            open={!0}
            maxWidth="sm"
            onClose={() => this.props.onClose()}
            fullWidth
            aria-labelledby="object-alias-dialog-title"
        >
            {this.renderAddNewAlias()}
            <DialogTitle id="object-alias-dialog-title">
                {this.state.usedInAliases.length ? I18n.t('This object is used in aliases') : I18n.t('This object does not used in any aliases yet')}
            </DialogTitle>
            <DialogContent>
                <MenuList style={{ maxWidth: 400 }}>
                    {this.state.usedInAliases.map(aliasID =>
                        <MenuItem
                            className={this.props.classes.usedInAlias}
                            key={aliasID}
                            onClick={() => this.props.onRedirect(aliasID)}
                        >
                            <ListItemIcon>
                                <IconLink fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{aliasID}</ListItemText>
                        </MenuItem>)}
                    <MenuItem
                        onClick={() => this.setState({ showAddNewAlias: true })}
                        className={this.props.classes.addNewAlias}
                    >
                        <ListItemIcon>
                            <AddLink fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{I18n.t('Create alias from this ID')}</ListItemText>
                    </MenuItem>
                </MenuList>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => this.props.onClose()}
                    startIcon={<Close />}
                    color="grey"
                >
                    {this.props.t('Close')}
                </Button>
            </DialogActions>
        </Dialog>;
    }
}

ObjectAliasEditor.propTypes = {
    t: PropTypes.func,
    socket: PropTypes.object,
    objects: PropTypes.object,
    onRedirect: PropTypes.func,
    obj: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default withWidth()(withStyles(styles)(ObjectAliasEditor));
