import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react';

const HealthRating: React.FC<{ rating: number }> = ({ rating }) => (
  <Rating
    icon={<FavoriteIcon />}
    emptyIcon={<FavoriteIcon />}
    value={3 - rating}
    max={3}
    readOnly
  />
);

export default HealthRating;
