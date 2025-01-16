import Orders from '@/components/Orders';
import React from 'react';
import { Box } from '@mui/material';

function Page() {
  return (
    <div className="bg-stone-700">
          <Box
      sx={{
        padding: 1,
        margin: 'auto',
        minWidth: '50%',
        maxWidth: '90%',
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Orders />
    </Box>
    </div>

  );
}

export default Page;
