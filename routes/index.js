//index.js
const express = require("express");
const adminRoutes = require("./auth.route");
const distributorRoutes = require("./distributer.route");
const distributorInterfaceRoutes = require("./distributerInterface.router");
const poolRoutes = require("./pool.route");
const publicRoutes = require("./public.route");
const globalRoutes = require("./global.route");
const productRoutes = require("./digitalProduct.route");
const predictionRoutes = require("./prediction.route");
const leagueRoutes = require("./league.route");
const dmquinielaRoutes = require("./dmquiniela.route");
const categoryRoutes = require("./category.route");
const catalogRoutes = require("./catalog.route");
const purchasedRoutes = require("./purchased.route");
// const { path } = require('../app');
const router = express.Router();

const defoultRoutes = [
  { path: "/api/public", route: publicRoutes },
  { path: "/api/admin", route: adminRoutes },
  { path: "/api/distributor", route: distributorRoutes },
  { path: "/api/pools", route: poolRoutes },
  { path: "/api/global", route: globalRoutes },
  { path: "/api/product", route: productRoutes },
  { path: "/api/predictions", route: predictionRoutes },
  { path: "/api/league", route: leagueRoutes },
  { path: "/api/dmquiniela", route: dmquinielaRoutes },
  { path: "/api/category", route: categoryRoutes },
  { path: "/api/catalog", route: catalogRoutes },
  { path: "/api/purchased", route: purchasedRoutes },
  { path: "/api/distributorInterface", route: distributorInterfaceRoutes },
];

defoultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

//   if (config.env === "development" || config.env === "local") {
//     devRoutes.forEach((route) => {
//       router.use(route.path, route.route);
//     });
//   }

module.exports = router;
