import React, { useState, useEffect } from "react";
import { setCDN } from "shiki";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import {
  copyToClipboard,
  removeEscapes,
  shikiTokenizer,
} from "../../../utils/bbe";
import Link from "next/link";

setCDN("https://unpkg.com/shiki/");

const codeSnippetData = [
  `import ballerina/http;

// Creates an HTTP client to interact with a remote endpoint.
// [followRedirects](https://docs.central.ballerina.io/ballerina/http/latest/records/FollowRedirects) record provides configurations associated with HTTP redirects.
http:Client clientEndpoint = check new ("http://localhost:9092", {
        followRedirects: {enabled: true, maxCount: 5}
    }
);

service / on new http:Listener(9090) {

    resource function get hello() returns string|error {
        // Sends a \`GET\` request to the specified endpoint and Retrieved the text payload from the response.
        string returnResult = check clientEndpoint->get("/redirect1");
        return "Response received : " + returnResult;
    }
}

service / on new http:Listener(9092) {

    resource function get redirect1(http:Caller caller) returns error? {
        http:Response res = new;
        // Sends a redirect response with a location.
        check caller->redirect(res,
            http:REDIRECT_TEMPORARY_REDIRECT_307,
            ["http://localhost:9093/redirect2"]);
    }
}

service /redirect2 on new http:Listener(9093) {

    resource function get .() returns string {
        // Sends a response to the caller.
        return "Hello World!";
    }
}
`,
];

export default function HttpRedirects() {
  const [click1, updateClick1] = useState(false);
  const [codeSnippets, updateSnippets] = useState([]);
  const [btnHover, updateBtnHover] = useState([false, false]);

  useEffect(() => {
    async function loadCode() {
      for (let snippet of codeSnippetData) {
        const output = await shikiTokenizer(snippet, "ballerina");
        updateSnippets((prevSnippets) => [...prevSnippets, output]);
      }
    }
    loadCode();
  }, []);

  return (
    <Container className="d-flex flex-column h-100">
      <h1>Redirects</h1>

      <p>
        The HTTP client supports redirection. To follow redirects when calling
        an external HTTP server using the Ballerina
      </p>

      <p>
        HTTP client connector, set <code>followRedirect</code> to{" "}
        <code>true</code>.&lt;br/&gt;&lt;br/&gt;
      </p>

      <p>For more information on the underlying module,</p>

      <p>
        see the{" "}
        <a href="https://docs.central.ballerina.io/ballerina/http/latest/">
          HTTP module
        </a>
        .
      </p>

      <Row className="bbeCode px-2 py-0 rounded" style={{ marginLeft: "0px" }}>
        <Col sm={10}>
          {codeSnippets[0] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[0]),
              }}
            />
          )}
        </Col>
        <Col className="d-flex align-items-start pt-2" sm={2}>
          <button
            className="btn rounded ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.0.3/http-redirects",
                "_blank"
              );
            }}
            aria-label="Edit on Github"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#000"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </button>
          {click1 ? (
            <button
              className="btn rounded"
              disabled
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#45FF00"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="btn rounded"
              onClick={() => {
                copyToClipboard(codeSnippetData[0]);
                updateClick1(true);
                setTimeout(() => {
                  updateClick1(false);
                }, 3000);
              }}
              aria-label="Copy to Clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-clipboard"
                viewBox="0 0 16 16"
              >
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
      </Row>

      <br />

      <Row className="bbeOutput p-2 rounded">
        <pre className="m-0">
          <code className="d-flex flex-column">
            <span>{`# Invoke the service using the "cURL" command below.`}</span>
            <span>{`curl -v http://localhost:9090/hello/`}</span>
            <span>{`*   Trying 127.0.0.1:9090...`}</span>
            <span>{`* TCP_NODELAY set`}</span>
            <span>{`* Connected to localhost (127.0.0.1) port 9090 (#0)`}</span>
            <span>{`> GET /hello/ HTTP/1.1`}</span>
            <span>{`> Host: localhost:9090`}</span>
            <span>{`> User-Agent: curl/7.68.0`}</span>
            <span>{`> Accept: */*`}</span>
            <span>{`> `}</span>
            <span>{`* Mark bundle as not supporting multiuse`}</span>
            <span>{`< HTTP/1.1 200 OK`}</span>
            <span>{`< content-type: text/plain`}</span>
            <span>{`< content-length: 32`}</span>
            <span>{`< server: ballerina`}</span>
            <span>{`< date: Wed, 2 Jun 2021 11:03:08 +0530`}</span>
            <span>{`< `}</span>
            <span>{`* Connection #0 to host localhost left intact`}</span>
            <span>{`Response received : Hello World!`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="bbeOutput p-2 rounded">
        <pre className="m-0">
          <code className="d-flex flex-column">
            <span>{`bal run http_redirects.bal`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Client - OAuth2 JWT Bearer grant type"
            href="/learn/by-example/http-client-oauth2-jwt-bearer-grant-type"
          >
            <div className="btnContainer d-flex align-items-center me-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[0] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([true, false])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <div className="d-flex flex-column ms-4">
                <span className="btnPrev">Previous</span>
                <span
                  className={btnHover[0] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([true, false])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Client - OAuth2 JWT Bearer grant type
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link title="CORS" href="/learn/by-example/http-cors">
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  CORS
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[1] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([false, true])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}