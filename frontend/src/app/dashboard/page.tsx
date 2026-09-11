"use client"
import { ACCESS_TOKEN } from '@/config/constants'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getCookie } from 'cookies-next'

const Dashboard = () => {
  // get user info from token
  const jwtPayload = getCookie(ACCESS_TOKEN)?.toString().split(".")[1]
  const payload = jwtPayload ? atob(jwtPayload?.toString()) : null;
  const user_info = payload ? JSON.parse(payload) : null;

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant='h6'>
        Welcome, Hi. {user_info?.username}
      </Typography>
    </Box>
  )
}

export default Dashboard