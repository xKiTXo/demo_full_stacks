import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { ReactNode } from 'react'


type ConfirmDialogProps = {
    open: boolean,
    okHandler: any,
    closeHandler: any,
    title?: string,
    content?: string | ReactNode
}

const ConfirmDialog = ({
    open,
    okHandler,
    closeHandler,
    title = "Confirm",
    content = ""
}: ConfirmDialogProps) => {

    const final_content = typeof content === "string" ? <DialogContentText>
        {content}
    </DialogContentText> : content;

    return (
        <Dialog
            open={open}
            onClose={closeHandler}
            sx={{ minWidth: 340 }}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent sx={{ minWidth: 240 }}>
                {final_content}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeHandler} autoFocus>
                    Cancel
                </Button>
                <Button onClick={okHandler}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog