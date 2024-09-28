import {
  CircularProgressProps,
  Box,
  CircularProgress,
  Typography
} from '@mui/material'

function CircularProgressWithLabel(
  props: CircularProgressProps & {
    totalNum: number
    currentNum: number
    percentage?: boolean
  }
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {props.percentage
            ? `${Math.round((100 * props.currentNum) / props.totalNum)}%`
            : `${props.currentNum}/${props.totalNum}`}
        </Typography>
      </Box>
      <div className="text-slate-800 font-normal text-xs">
        estimated rest time:{' '}
        {Math.ceil(10 * (((props.totalNum - props.currentNum) * 14) / 60)) / 10}
        m
      </div>
    </Box>
  )
}
export default CircularProgressWithLabel
