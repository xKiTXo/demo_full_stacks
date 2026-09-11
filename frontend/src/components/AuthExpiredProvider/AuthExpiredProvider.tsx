'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { setNeedLoginHandler } from '@/lib/AxiosImpl'

export default function AuthExpiredProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setNeedLoginHandler(() => setOpen(true))
    }, [])

    return (
        <>
            {children}
            <Dialog open={open}>
                <DialogTitle>
                    Session expired
                    </DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 480 }}>
                        <Typography variant='body1'>
                            Please login again.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={() => {
                            setOpen(false)
                            router.push('/login')
                        }}
                    >
                        Go to Login
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}