/** @type {import('syncpack').RcFile} */
module.exports = {
  $schema: "https://unpkg.com/syncpack@13.0.4/dist/schema.json",
  source: [
    "package.json",
    "shiritori-online/package.json",
    "kawaii-shiritori/package.json",
    "shiritori-word-chain/package.json",
  ],
  versionGroups: [
    {
      label: "React 18 (shiritori-online) vs React 19 (kawaii) — allowed to differ",
      packages: ["**"],
      dependencyTypes: ["prod", "dev"],
      dependencies: [
        "react",
        "react-dom",
        "@types/react",
        "@types/react-dom",
        "@vitejs/plugin-react",
      ],
      isIgnored: true,
    },
    {
      label: "Firebase SDK may differ while apps are split",
      packages: ["**"],
      dependencyTypes: ["prod"],
      dependencies: ["firebase"],
      isIgnored: true,
    },
  ],
};
