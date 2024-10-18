const dateService = require("@services/dateService");
const { CodeTableListModel, CodingDataModel } = require("../../models");
const { Sequelize,Op } = require("sequelize");
const { raw } = require("body-parser");

exports.test1 = async (req, res, next) => {
  try {
    const success = req.flash("success");
    const removeSuccess = req.flash('removeSuccess')

    // const page = "page" in req.query ? parseInt(req.query.page) : 1;
    // const perPage = 10;
    const codeTableList = await CodeTableListModel.findAll({
      raw: true,
      nest: true,
    });
    const codeTableListPresent = codeTableList.map((data) => {
      data.fa_createdAt = dateService.toPersianDate(data.createdAt,"YYYY/MM/DD");
      return data;
    });

    const count = await CodeTableListModel.count();
    // console.log(result);
    console.log(count);
    // res.send(result);
    
    // res.json(codeTableListPresent)

    let {draw,start,length,order_data} = request.query;
    let order = []

    if(typeof order_data == 'undefined')
    {

      order.push(['id','desc'])

    }
    else
    {
      let column_index = request.query.order[0]['column'];
      let column_name = request.query.columns[column_index]['data'];
      let column_sort_order = request.query.order[0]['dir'];
      
      order.push([column_name,column_sort_order])
    }

    //search data

    let search_value = req.query.search['value'];

    var search_query = `
     AND (customer_first_name LIKE '%${search_value}%' 
      OR customer_last_name LIKE '%${search_value}%' 
      OR customer_email LIKE '%${search_value}%' 
      OR customer_gender LIKE '%${search_value}%'
     )
    `;

    //Total number of records without filtering

    let total_records = CodingDataModel.count()
    let where = []
    where[Op.or] = [
      { code: { [Op.like]: `%${search_value}%` } },
      { en_TableName: { [Op.like]: `%${search_value}%` } },
      { fa_TableName: { [Op.like]: `%${search_value}%` } },
  ];
    console.log(where)

  const total_records_with_filter = CodingDataModel.count({
    where:where,
  })

  const data_arr = CodeTableListModel.findAll({
    where:where,
    order:order,
    limit:start,
    offset:length,
    raw:true,
    nest:true,
  })

    database.query("SELECT COUNT(*) AS Total FROM customer_table", function(error, data){

        var total_records = data[0].Total;

        //Total number of records with filtering

        database.query(`SELECT COUNT(*) AS Total FROM customer_table WHERE 1 ${search_query}`, function(error, data){

            var total_records_with_filter = data[0].Total;

            var query = `
            SELECT * FROM customer_table 
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;

            var data_arr = [];

            database.query(query, function(error, data){

                data.forEach(function(row){
                    data_arr.push({
                        'customer_first_name' : row.customer_first_name,
                        'customer_last_name' : row.customer_last_name,
                        'customer_email' : row.customer_email,
                        'customer_gender' : row.customer_gender
                    });
                });

                var output = {
                    'draw' : draw,
                    'iTotalRecords' : total_records,
                    'iTotalDisplayRecords' : total_records_with_filter,
                    'aaData' : data_arr
                };

              })
            })
          })



    res.render("./baseInformation/codeTableList/index", {
      layout: "main",
      codeTableList: codeTableListPresent,
      success,
      removeSuccess,
    });


  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const page = "page" in req.query ? parseInt(req.query.page) : 1;
    const perPage = 10;
    let order = []

    const {sort,desc} = req.query


    if(sort){
      order.push([sort,desc === 'true' ? 'DESC' : 'ASC'])
    }else{
      order=[]
      order.push(['id','DESC'])
    }

    const codeTableList = await CodeTableListModel.findAll({
      limit: perPage,
      offset: Math.max(0, (page - 1) * perPage),
      order: order,
      raw: true,
      nest: true,
    });

    const totalCodeTableLists = await CodeTableListModel.count();

    const codeTableListPresent = codeTableList.map((data) => {
      data.fa_createdAt = dateService.toPersianDate(data.createdAt,"YYYY/MM/DD");
      return data;
    });

    const totalPages = Math.ceil(totalCodeTableLists / perPage);
    const success = req.flash("success");
    const removeSuccess = req.flash('removeSuccess')

    let offset;
    let to;

    offset = (page - 1) * perPage;
    to = offset + perPage;

    const pagination = {
      page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : totalPages,
      prevPage: page > 1 ? page - 1 : 1,
      isMoreThan3Pages: totalPages > 3,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalCount: totalCodeTableLists,
      offset: offset == 0 ? 1 : offset + 1,
      to: page == totalPages ? totalCodeTableLists : to,
    };

    res.render("./baseInformation/codeTableList/index", {
      layout: "main",
      codeTableList: codeTableListPresent,
      pagination,
      helpers: {
        showDisabled: function (isDisabled, options) {
          return !isDisabled ? "disabled" : "";
        },
      },
      success,
      removeSuccess,
    });
    // res.send(result)
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = req.flash("errors");
    const success = req.flash("success");
    const hasError = errors.length > 0;
    // console.log('errors = ',errors)

    res.render("./baseInformation/codeTableList/create", {
      layout: "main",
      errors,
      hasError,
      success,
    });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    // res.send(req.body)
    const codeTableListData = {
      code: req.body.code,
      fa_TableName: req.body.fa_TableName,
      en_TableName: req.body.en_TableName,
      creator: "MHA",
    };

    const { id } = await CodeTableListModel.create(codeTableListData);
    console.log("id", id);

    if (id) {
      req.flash("success", "اطلاعات کدینگ جدید با موفقیت ثبت شد.");
      return res.redirect("./index");
    }

  } catch (error) {

    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      errors = error.message.split("SequelizeUniqueConstraintError");
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const errors = req.flash("errors");
    const hasError = errors.length > 0;
    const success = req.flash("success");
    const removeSuccess = req.flash('removeSuccess')

    const codeTableListId = await req.params.id;
    const codeTableList = await CodeTableListModel.findOne({
      where: { id: codeTableListId },
      raw: true,
      nest: true,
    });

    res.render("./baseInformation/codeTableList/edit", {
      layout: "main",
      codeTableList,
      fa_createdAt: dateService.toPersianDate(codeTableList.createdAt),
      fa_updatedAt: dateService.toPersianDate(codeTableList.updatedAt),
      errors,
      hasError,
      success,
      removeSuccess,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const codeTableListId = await req.params.id;

    const codeTableListData = {
      code: req.body.code,
      en_TableName: req.body.en_TableName,
      fa_TableName: req.body.fa_TableName,
      updated_at: new Date().toLocaleDateString("en-US"),
      updater: "MHA_Updated",
    };

    const rowsAffected = await CodeTableListModel.update(
      {
        code: codeTableListData.code,
        en_TableName: codeTableListData.en_TableName,
        fa_TableName: codeTableListData.fa_TableName,
        updatedAt: codeTableListData.updated_at,
        updater: codeTableListData.updater,
      },
      { where: { id: codeTableListId } }
    );

    console.log(req.params);

    if (rowsAffected[0] > 0) {
      req.flash("success", "اطلاعات با موفقیت اصلاح شد.");
      return res.redirect("../index");
    }

    req.flash("suuccess","اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...");
    return res.redirect('../index')

  } catch (error) {
    
    const codeTableListId = await req.params.id;

    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      req.flash("errors", errors);
      return res.redirect(`../edit/${codeTableListId}`);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      errors = error.message.split("SequelizeUniqueConstraintError");
      req.flash("errors", errors);
      return res.redirect(`../edit/${codeTableListId}`);
    }

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;
    const rowsAffected = await CodeTableListModel.destroy({
      where: { id: codeTableListId },
    });

    req.flash("success", "اطلاعات با موفقیت حذف شد.");
    if (rowsAffected > 0) {
      return res.redirect("../index");
    }
  } catch (error) {
    
    if (error.name === "SequelizeForeignKeyConstraintError") {
      req.flash("removeSuccess",'این اطلاعات در جایی دیگر استفاده شده و امکان حذف آن نیست !!!');
      return res.redirect(`../index`);
    }

    next(error);
  }

};
