import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import './LoadingSpinnerDemo.css';

const LoadingSpinnerDemo = () => {
  return (
    <div className="loading-spinner-demo">
      <h1>Loading Spinner Component Demo</h1>
      <p>This page showcases all the different variants of the new circular loading spinner.</p>
      
      <div className="demo-section">
        <h2>Size Variants</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Small</h3>
            <LoadingSpinner size="small" color="primary" />
          </div>
          <div className="demo-item">
            <h3>Medium</h3>
            <LoadingSpinner size="medium" color="primary" />
          </div>
          <div className="demo-item">
            <h3>Large</h3>
            <LoadingSpinner size="large" color="primary" />
          </div>
          <div className="demo-item">
            <h3>Extra Large</h3>
            <LoadingSpinner size="xl" color="primary" />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Color Variants</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Primary</h3>
            <LoadingSpinner size="medium" color="primary" />
          </div>
          <div className="demo-item">
            <h3>Secondary</h3>
            <LoadingSpinner size="medium" color="secondary" />
          </div>
          <div className="demo-item">
            <h3>Success</h3>
            <LoadingSpinner size="medium" color="success" />
          </div>
          <div className="demo-item">
            <h3>Warning</h3>
            <LoadingSpinner size="medium" color="warning" />
          </div>
          <div className="demo-item">
            <h3>Error</h3>
            <LoadingSpinner size="medium" color="error" />
          </div>
          <div className="demo-item">
            <h3>Gray</h3>
            <LoadingSpinner size="medium" color="gray" />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>With Text</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Loading...</h3>
            <LoadingSpinner size="large" color="primary" text="Loading..." />
          </div>
          <div className="demo-item">
            <h3>Processing</h3>
            <LoadingSpinner size="large" color="success" text="Processing your request..." />
          </div>
          <div className="demo-item">
            <h3>Saving</h3>
            <LoadingSpinner size="large" color="secondary" text="Saving changes..." />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Button Integration</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Primary Button</h3>
            <button className="demo-button primary">
              <LoadingSpinner size="small" color="white" />
              <span>Loading...</span>
            </button>
          </div>
          <div className="demo-item">
            <h3>Secondary Button</h3>
            <button className="demo-button secondary">
              <LoadingSpinner size="small" color="white" />
              <span>Processing...</span>
            </button>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Overlay Example</h2>
        <div className="demo-overlay-example">
          <div className="demo-content">
            <h3>Page Content</h3>
            <p>This simulates a page with content that could be covered by a loading overlay.</p>
            <button className="demo-button primary">Sample Button</button>
          </div>
          <div className="loading-spinner-overlay">
            <LoadingSpinner size="xl" color="primary" text="Loading page..." />
          </div>
        </div>
      </div>
    </div>
  );
};


