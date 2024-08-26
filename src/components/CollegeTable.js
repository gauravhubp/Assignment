import React, { useState, useEffect, useRef } from 'react';
import '../styles/CollegeTable.css';
import { collegeData } from '../data/collegeData';

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [displayedColleges, setDisplayedColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  useEffect(() => {
    setColleges(collegeData);
    setDisplayedColleges(collegeData.slice(0, 10));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const filteredColleges = colleges.filter((college) =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedColleges = sortColleges(filteredColleges);
    setDisplayedColleges(sortedColleges.slice(0, page * 10));
  }, [searchTerm, sortConfig, page, colleges]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }));
    setPage(1);
  };

  const sortColleges = (collegeList) => {
    if (!sortConfig.key) return collegeList;
    return [...collegeList].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <div className="college-table-container">
      <input
        type="text"
        placeholder="Search by college name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="college-table">
        <thead>
          <tr>
            <th>CD Rank</th>
            <th>Colleges</th>
            <th onClick={() => handleSort('courseFees')}>
              Course Fees
              {sortConfig.key === 'courseFees' && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th onClick={() => handleSort('placement')}>
              Placement
              {sortConfig.key === 'placement' && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th onClick={() => handleSort('userReviews')}>
              User Reviews
              {sortConfig.key === 'userReviews' && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th>Ranking</th>
          </tr>
        </thead>
        <tbody>
          {displayedColleges.map((college) => (
            <tr key={college.id}>
              <td>{college.cdRank}</td>
              <td>
                <div className="college-info">
                  {college.featured && <span className="featured-badge">Featured</span>}
                  <div>
                    <h3>{college.name}</h3>
                    <p>{college.location}</p>
                    <p>{college.approvals}</p>
                    <p>{college.courses}</p>
                    <div className="college-actions">
                      <button className="apply-btn">Apply Now</button>
                      <button className="download-btn">Download Brochure</button>
                      <button className="compare-btn">Add To Compare</button>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <p>₹ {college.courseFees.toLocaleString()}</p>
                <p>{college.feesType}</p>
                <p className="compare-fees">Compare Fees</p>
              </td>
              <td>
                <p>₹ {college.placement.toLocaleString()}</p>
                <p>Average Package</p>
                <p>₹ {college.highestPackage.toLocaleString()}</p>
                <p>Highest Package</p>
                <p className="compare-placement">Complete Placement</p>
              </td>
              <td>
                <div className="user-reviews">
                  <span className="star">★</span> {college.userReviews} /10
                  <p>Based on {college.totalReviews} User Reviews</p>
                  <p className="review-link">Read All Reviews</p>
                </div>
              </td>
              <td>
                <p>{college.ranking}</p>
                <p>{college.rankingYear}</p>
                <p className="more-info">+ {college.moreInfoCount} More</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={loader} className="loader">
        Loading...
      </div>
    </div>
  );
};

export default CollegeTable;