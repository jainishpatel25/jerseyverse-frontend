// src/components/JerseyCard.js
import React from 'react';

const JerseyCard = ({ jersey }) => {
  return (
    <div className="card h-100">
      <img
        src={jersey.image}
        className="card-img-top"
        alt={jersey.name}
        style={{ height: '250px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{jersey.name}</h5>
        <p className="card-text">{jersey.team}</p>
        <h6>₹{jersey.price}</h6>
        <a href={`/jersey/${jersey._id}`} className="btn btn-primary btn-sm">
          View Details
        </a>
      </div>
    </div>
  );
};

export default JerseyCard;
