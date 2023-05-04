import SendIcon from '@mui/icons-material/Send';
import { CircularProgress, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import DarkPaper from '../styled/DarkPaper';

const IpAddressInput = ({ setIsLoading, setData, setError, children }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const fetchScanResults = async (ip) => {
    setIsLoading(true)
    setIsLoadingLocal(true)
    await axios.get(`http://localhost:3000/scan?ip=${ip}`)
      .then((onfulfilled) => {
        setData(onfulfilled.data)
        setIsLoading(false)
        setIsLoadingLocal(false)
      }, (onrejected) => {
        setError(onrejected)
        setIsLoading(false)
        setIsLoadingLocal(false)
      })
      .catch(reason => {
        setError(reason)
        setIsLoading(false)
        setIsLoadingLocal(false)
      });

  };

  const handleSendClick = () => {
    console.log('IP Address:', ipAddress);
    fetchScanResults(ipAddress)
  };

  return (
    <div>
      <DarkPaper elevation={3} style={{ zIndex: 1000, position: 'absolute', width: '300px' }}>
        <TextField
          label="IP Address"
          variant="outlined"
          color="secondary"
          value={ipAddress}
          onChange={(event) => setIpAddress(event.target.value)}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{
            flexGrow: 1,
            marginRight: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
        />
        <IconButton color="secondary" onClick={handleSendClick}>
          {isLoadingLocal ? <CircularProgress /> : <SendIcon />}
        </IconButton>
      </DarkPaper>
      {children}
    </div>
  );
};

export default IpAddressInput;
