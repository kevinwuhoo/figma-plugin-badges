import Head from "next/head";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const DEFAULT_PLUGIN_URL =
  "https://www.figma.com/community/plugin/854152902511629627/Vector-Logos";

export default function Home() {
  const [pluginUrl, setPluginUrl] = useState("");

  let pluginId: string = "";
  try {
    const parsedPluginUrl = new URL(pluginUrl ? pluginUrl : DEFAULT_PLUGIN_URL);
    pluginId = parsedPluginUrl.pathname.split("/")[3] || "";
  } catch (error) {
    console.error(error);
  }
  const badgeUrls = {
    likes: `https://figma-plugin-badges.vercel.app/api/likes/${pluginId}`,
    installs: `https://figma-plugin-badges.vercel.app/api/installs/${pluginId}`,
  };

  return (
    <Layout>
      <Header />
      <Input pluginUrl={pluginUrl} setPluginUrl={setPluginUrl} />
      {pluginId !== "" && (
        <>
          <Badges badgeUrls={badgeUrls} pluginUrl={pluginUrl} />
          <BadgeCode badgeUrls={badgeUrls} pluginUrl={pluginUrl} />
        </>
      )}
    </Layout>
  );
}

function Heading({ children }) {
  return (
    <>
      <p>{children}</p>
      <style jsx>{`
        p {
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}

function Badges({ badgeUrls, pluginUrl }) {
  return (
    <>
      <Heading>Badge Preview</Heading>
      <div className="wrapper">
        <BadgeHTML badgeUrl={badgeUrls.installs} pluginUrl={pluginUrl} />
        <div className="spacer" />
        <BadgeHTML badgeUrl={badgeUrls.likes} pluginUrl={pluginUrl} />
      </div>
      <style jsx>{`
        .wrapper {
          background-color: rgb(245, 242, 240);
          padding: 1rem;
        }
        .spacer {
          display: inline-block;
          width: 1rem;
        }
      `}</style>
    </>
  );
}

function BadgeCode({ badgeUrls, pluginUrl }) {
  const [outputType, setOutputType] = useState<"HTML" | "Markdown">("HTML");
  const language = outputType === "HTML" ? "jsx" : "markdown";
  const customStyle = { fontSize: "0.75rem", whiteSpace: "pre-wrap" };

  const renderCode = (badgeUrl) =>
    renderToStaticMarkup(
      outputType === "HTML" ? (
        <BadgeHTML badgeUrl={badgeUrl} pluginUrl={pluginUrl} />
      ) : (
        <BadgeMarkdown badgeUrl={badgeUrl} pluginUrl={pluginUrl} />
      )
    );

  return (
    <>
      <div className="button-group">
        <button
          className={`button ${outputType === "HTML" ? "active" : ""}`}
          onClick={() => setOutputType("HTML")}
        >
          HTML
        </button>
        <button
          className={`button ${outputType === "Markdown" ? "active" : ""}`}
          onClick={() => setOutputType("Markdown")}
        >
          Markdown
        </button>
      </div>
      <div className="code">
        <div>
          <Heading>Installs</Heading>
          <SyntaxHighlighter language={language} customStyle={customStyle}>
            {renderCode(badgeUrls.installs)}
          </SyntaxHighlighter>
        </div>
        <div>
          <Heading>Likes</Heading>
          <SyntaxHighlighter language={language} customStyle={customStyle}>
            {renderCode(badgeUrls.likes)}
          </SyntaxHighlighter>
        </div>
      </div>
      <style jsx>{`
        // doesn't seem like there's a way to override these inline styles
        .code :global(code) {
          word-break: break-all !important;
          white-space: pre-wrap !important;
        }
        .badge {
          width: 480px;
        }
        .button-group {
          margin-top: 2rem;
        }
        .button {
          border: 2px solid #001eb2;
          border-color: #1940ff;
          border-radius: 4px;
          background-color: #fff;
          cursor: pointer;
          font-size: 1rem;
          padding: 0.5rem 0.75rem;
          outline: 0;
        }
        .button.active {
          background-color: #1940ff;
          color: #fff;
        }
        .button-group .button:not(:first-child) {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: 0;
        }
        .button-group .button:not(:last-child) {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      `}</style>
    </>
  );
}

function BadgeHTML({ badgeUrl, pluginUrl }) {
  return (
    <a href={pluginUrl}>
      <img src={`https://img.shields.io/endpoint?url=${badgeUrl}`} />
    </a>
  );
}

function BadgeMarkdown({ badgeUrl, pluginUrl }) {
  return (
    <>{`[![](https://img.shields.io/endpoint?url=${badgeUrl})](${pluginUrl})`}</>
  );
}

function Header() {
  return (
    <>
      <header>
        <h1>Figma Plugin Badges</h1>
        <div>Display install and like counts of your Figma plugin</div>
      </header>
      <style jsx>{`
        header {
          text-align: center;
        }
        h1 {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </>
  );
}

function Input({ setPluginUrl, pluginUrl }) {
  return (
    <>
      <label htmlFor="url">Figma Plugin Url</label>
      <input
        id="url"
        onChange={(event) => setPluginUrl(event.target.value)}
        placeholder="Enter a plugin url"
        type="text"
        value={pluginUrl}
      />
      <div className="instructions">
        <span>To find the url for your plugin, search for it on Figma: </span>
        <a href="https://www.figma.com/community/explore?tab=plugins">
          figma.com/community/explore?tab=plugins
        </a>
      </div>
      <style jsx>{`
        label {
          display: block;
          font-size: 0.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
        }
        input {
          border: 1px solid slategray;
          border-radius: 4px;
          font-size: 1rem;
          margin-top: 0.25rem;
          padding: 1rem 0.75rem;
          width: 90%;
        }
        .instructions {
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
}

function Layout({ children }) {
  return (
    <div className="container">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </Head>
      {children}
      <style jsx global>
        {`
          html,
          body {
            font-family: "Merriweather", serif;
            font-size: 20px;
          }
          button,
          input {
            font-family: "Merriweather", serif;
          }
          pre {
            white-space: pre-wrap;
          }
          code {
            font-family: "Source Code Pro", monospace;
          }
        `}
      </style>
      <style jsx>{`
        .container {
          width: 960px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
