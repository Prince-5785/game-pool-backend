"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS pool_views;`);

    await queryInterface.sequelize.query(`
      CREATE VIEW pool_views AS
      SELECT
        p.id,
        p.key,
        p.start_sale_date,
        p.start_sale_time,
        p.first_match_start_date,
        p.last_match_start_date,
        p.end_sale_date,
        p.pool_results_status,
        p.dmquiniela_id,
        p.total_doubles,
        p.total_triples,
        p.status,
        p.view,
        p.ecommerce_expiry,
        p.online,
        p.type,

        -- pool_status column logic
        CASE
          WHEN NOW() BETWEEN p.first_match_start_date AND p.last_match_start_date THEN 'ongoing'
          WHEN NOW() < p.first_match_start_date THEN 'upcoming'
          WHEN NOW() > p.last_match_start_date THEN 'completed'
          ELSE NULL
        END AS pool_status,

        -- pool_sales_status column logic
        CASE
          WHEN NOW() BETWEEN 
            TIMESTAMP(p.start_sale_date) + INTERVAL p.start_sale_time HOUR_SECOND AND 
            TIMESTAMP(p.end_sale_date) THEN 'active'
          ELSE 'inactive'
        END AS pool_sales_status

      FROM pools p;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS pool_views;`);
  },
};
