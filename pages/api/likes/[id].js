import createBadge from "../../../lib";

export default async (req, res) => {
  return createBadge("like_count", "Likes", req, res);
};
