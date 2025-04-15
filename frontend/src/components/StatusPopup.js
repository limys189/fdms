// components/StatusPopup.js
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
  DialogTitle,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StatusPopup = ({ loading, error, onClose }) => {

  // 키 핸들러
  const handleKeyDown = (e) => {
//    console.log('KEY  ::  ', e.key);
    if (e.key === 'Enter' || e.key === 'Escape') {
      onClose();
    }
  };

  // 에러 다이얼로그가 열릴 때마다 이벤트 리스너 등록
  useEffect(() => {
    if (error) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [error]);

  return (
    <>
      {/* 로딩 팝업 */}
      <Dialog
        open={loading}
        onClose={onClose}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent>
          <CircularProgress size={60} thickness={4} />
        </DialogContent>
      </Dialog>

      {/* 에러 팝업 */}
      <Dialog
        open={!!error}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}
        >
          오류 발생
          <IconButton
            onClick={onClose}
            sx={{ marginLeft: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          aria-describedby="alert-dialog-description"
          sx={{ padding: '20px 24px' }}
        >
          <Alert
            severity="error"
            sx={{ fontSize: '0.9rem', '& .MuiAlert-message': { padding: '8px 0' } }}
          >
            {error}
          </Alert>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatusPopup;
