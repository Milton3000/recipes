import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Review = ({ recipeID, authToken, userID }) => {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/reviews/${recipeID}`);
        setReviews(response.data); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [recipeID]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/reviews", {
        recipeId: recipeID,
        userId: userID,
        review,
      }, {
        headers: { authorization: authToken }
      });

      setReview(""); // Clear the review form
      const updatedResponse = await axios.get(`http://localhost:3001/reviews/${recipeID}`);
      setReviews(updatedResponse.data); 
    } catch (error) {
      console.error(error);
    }
  };

  const toggleReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleReviewSubmit}>
        <div className="form-group">
          <label htmlFor="review">Add a Review:</label>
          <textarea className="form-control" id="review" rows="4" value={review} onChange={(e) => setReview(e.target.value)} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <div className="text-center"> 
        <h5>Reviews:</h5>
        <ul className="list-group mx-auto" style={{ maxWidth: '300px' }}>
          {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review, index) => ( 
            <li className="list-group-item" key={index}>{review.review}</li>
          ))}
        </ul>
        {reviews.length > 3 && (
          <button className="btn btn-link mt-2" onClick={toggleReviews}>
            {showAllReviews ? 'Hide' : 'Show All'} Reviews
          </button>
        )}
      </div>
    </div>
  );
};

export default Review;
