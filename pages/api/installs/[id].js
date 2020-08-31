import createBadge from "../../../lib";

export default async (req, res) => {
  return createBadge("install_count", "Installs", req, res);
};
