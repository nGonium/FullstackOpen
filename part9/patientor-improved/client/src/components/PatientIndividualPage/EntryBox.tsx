import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode;
}

const EntryBox = ({ children }: Props) => (
  <Paper variant="outlined">
    <Box paddingX={2} paddingY={0.25}>
      {children}
    </Box>
  </Paper>
);

export default EntryBox;
