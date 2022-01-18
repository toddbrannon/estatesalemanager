import express from 'express';
import { Db, ObjectId } from 'mongodb';
import { Sale, getSaleSectionConfig } from '../../types'
// Delete after testing users route with query included in this file (8/20/2021)
import { pool } from '../../config/database';
import { isConditionalExpression } from 'typescript';
import { stringify } from 'querystring';
import { saleToInvoice } from '../../invoice';
const { requiresAuth } = require('express-openid-connect');

class IndexRouter {
  readonly router: express.Router;
  readonly db: Db;
  constructor(db: Db) {
    this.router = express.Router();
    this.db = db;
  }

  async getRouter() {
    // Root route===================================================================
    // this.router.get("/login", (req, res) => {
    //     res.render("login", {
    //         title: 'True Legacy Homes'
    //     });
    // })

    // this.router.get("/register", (req, res) => {
    //     res.render("register", {
    //         title: 'True Legacy Homes'
    //     })
    // })

    // this.router.post('/register', (req, res) => {
    //     const hashedPassword = bcrypt.hash(req.body.password, 10)
    //     let data = {
    //         first_name: req.body.firstname,
    //         last_name: req.body.lastname,
    //         email_address: req.body.email,
    //         username: req.body.username,
    //         password: hashedPassword
    //     }
    //     let sql = "INSERT INTO users SET ?";
    //     let query = pool.query(sql, data, (err, data) => {
    //         if (err) throw err;
    //         res.redirect("/login");
    //     });
    // });

    // this.router.get('/users', requiresAuth(), (req, res) => {
    //     let sql = "SELECT * FROM users";
    //     let query = pool.query(sql, (err, rows, fields) => {
    //         console.log("Fetched users successfully")
    //         if (err) throw err;
    //         console.log(rows)
    //         res.render('userindex', {
    //             title: 'True Legacy Homes Sale Manager Users',
    //             users: rows,
    //             authUser: req.oidc.user
    //         });
    //     });
    // });

    // Main landing page GET route
    this.router.get("/", (req, res) => {
      res.render("landing", {
        title: "True Legacy Homes",
      });
    });

    // For test - to get userInfo
    this.router.get('/user-info', async (req, res) => {
      // req.oidc is added by auth0 so it fails to match the Request type
      const userInfo = await req['oidc'].fetchUserInfo();
      // const userInfo = await req.oidc.fetchUserInfo();
      res.json(userInfo);
    })

    // Sale detail GET route (using the 'sale' template)
    this.router.get("/sale/:id?", requiresAuth(), async (req, res) => {
      let sale;
      try {
        let sql = `SELECT * from market; SELECT * from service; SELECT * from cashier; 
        SELECT * from salesPerson; SELECT * from pos_id; SELECT * from trailer_number; 
        SELECT * from opening_day; SELECT * from state;`;
        if (req.params.id) {
          sale = await this.db.collection('sales')
            .findOne({ _id: new ObjectId(req.params.id) }) as Sale;
          if (!sale) {
            throw 'Id not found.';
          }
        }

        sale = setStatus(sale || {});

        pool.query(sql, (err, rows, results) => {
          // console.log(rows);
          if (err)
            throw err;
          res.render('sale', {
            title: 'True Legacy Homes Sale Manager New Sale',
            authUser: req['oidc'].user,
            marketArray: rows[0],
            serviceArray: rows[1],
            cashierArray: rows[2],
            salesPersonArray: rows[3],
            posIdArray: rows[4],
            trailerNumberArray: rows[5],
            openingDayArray: rows[6],
            stateArray: rows[7],
            sale: sale
          });
        });
      } catch (err) {
        console.log("Failed to insert data into input table")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    const setStatus = (sale) => {
      const sections = getSaleSectionConfig();
      sale.status = { section: '', index: -1, reason: '' };

      for (let i = 0; i < sections.length; ++i) {
        sale.status.index = i;
        sale.status.section = sections[i].name;

        let broken = false;
        for (let j = 0; j < sections[i].fields.length; ++j) {
          if (!sale[sections[i].fields[j]]) {
            sale.status.reason = sections[i].fields[j];
            broken = true;
            break;
          }
        }
        if (broken) {
          break;
        }
      }

      return sale
    }

    // All sales GET route
    this.router.get('/sales', requiresAuth(), async (req, res) => {
      let sales =
        await this.db.collection('sales').find().toArray() as Sale[];

      // Define the status of the sale ---
      const sections = getSaleSectionConfig();
      const statuses = new Array();
      for (let s = 0; s < sales.length; ++s) {
        const status = { section: '', index: -1, reason: '' };
        for (let i = 0; i < sections.length; ++i) {
          status.index = i;
          status.section = sections[i].name;

          let broken = false;
          for (let j = 0; j < sections[i].fields.length; ++j) {
            if (!sales[s][sections[i].fields[j]]) {
              status.reason = sections[i].fields[j];
              broken = true;
              break;
            }
          }
          if (broken) {
            break;
          }
        }
        statuses.push(status);
      }
      // ----

      res.render('sales', {
        title: 'True Legacy Homes Sale Manager - All Sales',
        saleresults: sales,
        salestatuses: statuses, //array of { section: '', index: -1, reason: '' } defining the status of each sale
        sectioncount: sections.length,
        authUser: req['oidc'].user
      });
    })

    // POST request from the input form
    this.router.post('/sale/:id?', requiresAuth(), async (req, res) => {
      console.log("Trying to add a new sale")
      console.log("Job name is " + req.body.jobName)

      const sale: Sale = {
        jobName: req.body.jobName,
        hoursStagingBudget: req.body.hoursStagingBudget,
        market: req.body.market,
        hoursStagingActual: req.body.hoursStagingActual,
        minimumBase: req.body.minimumBase,
        services: req.body.services,
        minimumActual: req.body.minimumActual,
        saleDate: req.body.saleDate,
        hoursEstateSaleBudget: req.body.hoursEstateSaleBudget,
        minimumDiscount: req.body.minimumDiscount,
        cashier: req.body.cashier,
        hoursEstateSaleActual: req.body.hoursEstateSaleActual,
        salesPerson: req.body.salesPerson,
        disposalFee: req.body.disposalFee,
        posId: req.body.posId,
        grossSalesBudget: req.body.grossSalesBudget,
        splitFee: req.body.splitFee,
        disposalLoadCount: req.body.disposalLoadCount,
        trailerNumber: req.body.trailerNumber,
        grossSalesActualClover: req.body.grossSalesActualClover,
        disposalVendorCost: req.body.disposalVendorCost,
        openingDay: req.body.openingDay,
        adView: req.body.adView,
        grossSales8To10: req.body.grossSales8To10,
        transactions8To10: req.body.transactions8To10,
        emailsSent: req.body.emailsSent,
        grossSalesOpeningDay: req.body.grossSalesOpeningDay,
        transactionsOpeningDay: req.body.transactionsOpeningDay,
        clientName: req.body.clientName,
        checkPayableTo: req.body.checkPayableTo,
        paymentDueDate: req.body.paymentDueDate,
        clientEmail: req.body.clientEmail,
        transactionTotal: req.body.transactionTotal,
        clientMailingAddress1: req.body.clientMailingAddress1,
        clientMailingAddress2: req.body.clientMailingAddress2,
        clientMailingCity: req.body.clientMailingCity,
        grossSalesCreditDebit: req.body.grossSalesCreditDebit,
        grossSalesCash: req.body.grossSalesCash,
        cashOutsideClover: req.body.cashOutsideClover,
        commissionRate: req.body.commissionRate,
        clientMailingState: req.body.clientMailingState,
        clientPostalCode: req.body.clientPostalCode,
        taxesFees: req.body.taxesFees,
        additionalDonationLoanCost: req.body.additionalDonationLoanCost,
        courtesyDiscount: req.body.courtesyDiscount,
        postSaleHours: req.body.postSaleHours
      };

      try {
        let id = req.params.id;
        if (id) {
          const result = await this.db.collection('sales').updateOne(
            { '_id': new ObjectId(id) },
            { $set: sale },
            { upsert: true }
          );
          console.log("Updated a input with id: " + id)
        } else {
          const result = await this.db.collection('sales').insertOne(sale);
          console.log("Inserted a new input with id: " + id)
          id = result.insertedId;
        }
        if (!id) {
          throw new Error('Error while inserting or updating sale.');
        }
        console.log("market is " + sale.market)
        console.log("service is " + sale.services)
        console.log("sale date is " + sale.saleDate)
        res.json({ id: id });
        res.end();
      } catch (err) {
        console.log("Failed to insert data into input table")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    // DESTROY ROUTE - delete sale
    this.router.delete("/:id", requiresAuth(), async (req, res) => {
      try {
        let Sale;
        if (req.params.id) {
          Sale = await this.db.collection('sales')
          Sale.findOneAndDelete({ "_id": new ObjectId(req.params.id) }, (error, result) => {
            if (result.ok && result.value) {
              res.sendStatus(200);
            } else {
              //error
              res.sendStatus(500);
            }
          });
        }
      } catch (err) {
        console.log("Failed to delete data")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    this.router.get('/invoice/:id?', requiresAuth(), async (req, res) => {
      try {
        let sale;
        if (req.params.id) {
          sale = await this.db.collection('sales')
            .findOne({ _id: new ObjectId(req.params.id) }) as Sale;
          if (!sale) {
            throw 'Id not found.';
          }
        } else {
          sale = {};
        }

        res.render('invoice', {
          title: 'True Legacy Homes Sale Manager New Sale',
          authUser: req['oidc'].user,
          invoice: saleToInvoice(sale),
          sale
        });

      } catch (err) {
        console.log("Failed to insert data into input table")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    this.router.get('/admin', requiresAuth(), async (req, res) => {
      try {
        let sql = `SELECT * from market;
        SELECT * from service; SELECT * from cashier; 
         SELECT * from salesPerson; SELECT * from pos_id; SELECT * from trailer_number; 
        SELECT * from opening_day order by opening_day_id;`;
        pool.query(sql, (err, rows, results) => {
          if (err)
            throw err;
          res.render('admin/dropdowns', {
            title: 'Admin Config',
            authUser: req['oidc'].user,
            marketArray: rows[0],
            serviceArray: rows[1],
            cashierArray: rows[2],
            salesPersonArray: rows[3],
            posIdArray: rows[4],
            trailerNumberArray: rows[5],
            openingDayArray: rows[6],
            stateArray: rows[7],
          });
        })

      } catch (err) {
        console.log("Failed to insert data into input table")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    async function getDropdownRowsFrom(tablename, sqlWhereOrder = '') {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * from ${tablename} ${sqlWhereOrder}`;
        pool.query(sql, (err, rows, results) => {
          if (err)
            reject()
          resolve(JSON.stringify(rows));
        });
      })

    }

    this.router.get("/dropdown/:db", async (req, res) => {
      try {
        const rows = await getDropdownRowsFrom(req.params.db);
        res.status(200).json(JSON.parse(rows as string))
      } catch (err) {
        res.sendStatus(500)
        return
      }
    })

    this.router.post("/dropdown", requiresAuth(), async (req, res) => {
      try {
        const { db, dbvalue, dbname, name } = req.body;
        //get next id --
        const stringRows = await getDropdownRowsFrom(db, `order by ${dbvalue} desc limit 1`);
        const rows = JSON.parse(stringRows as string);
        const nextId = rows[0][dbvalue] + 1;
        // --
        let sql = `INSERT ${db} (${[dbvalue]},${[dbname]}) VALUES('${nextId}','${name}')`;

        pool.query(sql, (err, rows, results) => {
          if (err)
            throw err;
          res.status(rows.affectedRows ? 200 : 500).json({ insertId: rows.insertId })
        })
      } catch (err) {
        console.log("Failed to insert data into input table")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    this.router.put("/dropdown", requiresAuth(), async (req, res) => {
      try {
        const { db, dbvalue, dbname, value, name } = req.body;
        let sql = `UPDATE ${db} SET ${[dbname]}='${name}' WHERE ${[dbvalue]}='${value}' LIMIT 1`;

        pool.query(sql, (err, rows, results) => {
          if (err)
            throw err;
          res.status(rows.affectedRows ? 200 : 500).json({ insertId: rows.insertId })
        })
      } catch (err) {
        console.log("Failed to update data into input table")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    this.router.delete("/dropdown/:db/:dbvalue/:value", requiresAuth(), async (req, res) => {
      try {
        const { db, dbvalue, value } = req.params
        if (db && dbvalue && value) {
          let sql = `DELETE FROM ${db} WHERE ${[dbvalue]}='${value}' LIMIT 1`;

          pool.query(sql, (err, rows, results) => {
            if (err)
              throw err;
            res.status(rows.affectedRows ? 200 : 500).json()
          })
        }
      } catch (err) {
        console.log("Failed to delete data into input table")
        console.log(err)
        res.sendStatus(500)
        return
      }
    })

    return this.router;
  }
}

export { IndexRouter };
