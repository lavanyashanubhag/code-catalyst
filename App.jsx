
import { useState } from 'react';
import './App.css';

const sampleCode = `def final_price(price, discount_percent):
    return price - discount_percent

print(final_price(1000, 20))`;

function App() {
  const [code, setCode] = useState(sampleCode);
  const [language, setLanguage] = useState('Python');
  const [findings, setFindings] = useState([]);
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  async function reviewCode() {
    if (!code.trim()) {
      setError('Please enter some code before reviewing.');
      setReviewed(false);
      setFindings([]);
      return;
    }

    setLoading(true);
    setError('');
    setReviewMessage('');
    setReviewed(false);
    setFindings([]);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/review',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            code: code,
            language: language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || `Server error: ${response.status}`
        );
      }

      if (!Array.isArray(data.findings)) {
        throw new Error(
          'Unexpected response from the backend. Please check the API format.'
        );
      }

      setFindings(data.findings);
      setReviewMessage(data.message || 'Code review completed.');
      setReviewed(true);
    } catch (err) {
      console.error('Code review failed:', err);

      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Make sure FastAPI is running and CORS is enabled.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function resetCode() {
    setCode(sampleCode);
    setLanguage('Python');
    setFindings([]);
    setReviewed(false);
    setLoading(false);
    setError('');
    setReviewMessage('');
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">CC</div>
          <div>
            <h2>CODE CATALYST</h2>
            <span>AI CODE REVIEW</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <button className="nav-item active" type="button">
          ⌘ &nbsp; Code Review
        </button>

        <button className="nav-item" type="button" onClick={resetCode}>
          + &nbsp; New Review
        </button>

        <div className="sidebar-bottom">
          <span className="status-dot"></span>
          Local workspace
          <p>CODE CATALYST · v1.0</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <p className="breadcrumb">
            Workspace / <strong>Code Review</strong>
          </p>

          <div className="profile">
            <span className="avatar">CC</span>
            Developer
          </div>
        </header>

        <section className="content">
          <div className="heading-row">
            <div>
              <div className="eyebrow">INTELLIGENT CODE ANALYSIS</div>
              <h1>Code Review Assistant</h1>
              <p className="subtitle">
                Find potential bugs and improve code quality with
                code analysis.
              </p>
            </div>

            <span className="project-tag">
              ● Project: Checkout
            </span>
          </div>

          <div className="stats">
            <div className="stat-card">
              <span className="stat-icon purple">⌘</span>
              <div>
                <p>Files reviewed</p>
                <h2>{reviewed ? '1' : '0'}</h2>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon orange">!</span>
              <div>
                <p>Potential issues</p>
                <h2>{reviewed ? findings.length : '—'}</h2>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon green">✓</span>
              <div>
                <p>Review status</p>
                <h2 className="status-text">
                  {loading
                    ? 'Reviewing'
                    : reviewed
                      ? 'Complete'
                      : error
                        ? 'Failed'
                        : 'Ready'}
                </h2>
              </div>
            </div>
          </div>

          <div className="workspace">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>Source Code</h3>
                  <p>Paste or edit the code you want to review.</p>
                </div>

                <span className="file-badge">
                  ◇ {language === 'Python'
                    ? 'main.py'
                    : language === 'JavaScript'
                      ? 'main.js'
                      : 'Main.java'}
                </span>
              </div>

              <div className="editor-toolbar">
                <label htmlFor="language">Language</label>

                <select
                  id="language"
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    setReviewed(false);
                    setFindings([]);
                    setError('');
                    setReviewMessage('');
                  }}
                >
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>Java</option>
                </select>

                <button
                  className="sample-btn"
                  type="button"
                  onClick={resetCode}
                >
                  Reset sample
                </button>
              </div>

              <textarea
                className="code-input"
                aria-label="Source code editor"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setReviewed(false);
                  setFindings([]);
                  setError('');
                  setReviewMessage('');
                }}
                spellCheck="false"
                placeholder="Paste your source code here..."
              />

              <div className="editor-footer">
                <span>{code.split('\n').length} lines</span>
                <span>{code.length} characters</span>
              </div>

              <button
                className="review-btn"
                type="button"
                onClick={reviewCode}
                disabled={!code.trim() || loading}
              >
                {loading ? 'Reviewing code...' : '✦  Review Code'}
              </button>

              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}

              <p className="demo-note">
                Connected to the CODE CATALYST review API.
              </p>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>Review Findings</h3>
                  <p>Potential issues and improvement suggestions.</p>
                </div>

                <span className="count-badge">
                  {loading
                    ? 'Analyzing...'
                    : reviewed
                      ? `${findings.length} finding${findings.length === 1 ? '' : 's'}`
                      : 'Not reviewed'}
                </span>
              </div>

              {loading ? (
                <div className="empty-state">
                  <div className="empty-icon">⌕</div>
                  <h3>Analyzing your code...</h3>
                  <p>Waiting for the backend to return its findings.</p>
                </div>
              ) : error ? (
                <div className="empty-state">
                  <div className="empty-icon">!</div>
                  <h3>Review failed</h3>
                  <p>Check the error message in the source code panel.</p>
                  <button
                    className="sample-btn"
                    type="button"
                    onClick={reviewCode}
                  >
                    Try again
                  </button>
                </div>
              ) : !reviewed ? (
                <div className="empty-state">
                  <div className="empty-icon">⌕</div>
                  <h3>Ready to review</h3>
                  <p>
                    Submit your source code to see findings returned
                    by the backend.
                  </p>

                  <div className="finding-types">
                    <span>Bug detection</span>
                    <span>Code analysis</span>
                    <span>Suggestions</span>
                  </div>
                </div>
              ) : findings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✓</div>
                  <h3>No findings returned</h3>
                  <p>
                    The backend did not report any issues for this
                    submission. This does not guarantee the code is
                    completely free of bugs.
                  </p>
                </div>
              ) : (
                <div className="findings-list">
                  {findings.map((finding, index) => (
                    <div className="finding" key={index}>
                      <span
                        className="severity"
                        style={{
                          backgroundColor:
                            finding.severity?.toLowerCase() === 'high'
                              ? '#fee2e2'
                              : finding.severity?.toLowerCase() === 'medium'
                                ? '#fef3c7'
                                : '#e0e7ff',
                          color:
                            finding.severity?.toLowerCase() === 'high'
                              ? '#991b1b'
                              : finding.severity?.toLowerCase() === 'medium'
                                ? '#92400e'
                                : '#3730a3',
                        }}
                      >
                        {finding.severity || 'Issue'}
                      </span>

                      <h3>{finding.title || 'Code issue'}</h3>

                      {finding.line != null && (
                        <p>Line: {finding.line}</p>
                      )}

                      {finding.category && (
                        <p>Category: {finding.category}</p>
                      )}

                      <p className="finding-description">
                        {finding.explanation || finding.message || 'No additional details provided.'}
                      </p>

                      {finding.suggestion && (
                        <>
                          <h4>Suggested improvement</h4>
                          <div className="code-example suggestion">
                            {finding.suggestion}
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {reviewMessage && (
                    <p className="disclaimer">{reviewMessage}</p>
                  )}
                </div>
              )}
            </section>
          </div>

          <footer className="page-footer">
            <span>CODE CATALYST</span>
            <span>
              Code Review Assistant · Hackathon Project
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
