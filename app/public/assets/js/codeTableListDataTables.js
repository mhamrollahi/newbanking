
$(document).ready(function () {
  $("#codeTableListTable").DataTable({
    ajax: {
      url: "/baseInformation/codeTableList/api/getData",
      dataSrc: "",
    },
    columns: [
      { 
        data: null,
        render:function(data,type,row,meta){
          return meta.row + 1
        },
      },
      // {
      //   data: "code",
      //   render: function (data, type, row) {
      //     return `
      //     <a class="dt-felid" href="/baseInformation/codingData/index/${row.id}"  title="برای وارد کردن جزییات جدول کلیک کنید..">${data}</a>
      //   `;
      //   },
      // },
      {
        data: "en_TableName",
        render: function (data, type, row) {
          return `
          <div class="row-table text-center">
            <span>${data}</span>
            <div class= "table-action-buttons"> 
            <a class="edit button button-box button-xs button-success" href="/baseInformation/codingData/index/${row.id}"  title='برای وارد کردن جزییات جدول کلیک کنید..'>
              <i class="zmdi zmdi-more"></i>
            </a>
            <a class="edit button button-box button-xs button-info" href="/baseInformation/codeTableList/edit/${row.id}">
              <i class="zmdi zmdi-edit"></i>
            </a>
            <a class="delete button button-box button-xs button-danger" href="/baseInformation/codeTableList/delete/${row.id}" onclick="return confirm('آیا از عملیات حذف مطمين هستید؟');" >
              <i class="zmdi zmdi-delete"></i>
            </a>
            </div>
          </div>
        `;
        },
      },
      {
        data: "fa_TableName",
        render: function (data, type, row) {
          return `
          <div class="row-table text-center">
            <span>${data}</span>
            <div class= "table-action-buttons"> 
            <a class="edit button button-box button-xs button-success" href="/baseInformation/codingData/index/${row.id}"  title='برای وارد کردن جزییات جدول کلیک کنید..'>
              <i class="zmdi zmdi-file-text"></i>
            </a>
            <a class="edit button button-box button-xs button-info" href="/baseInformation/codeTableList/edit/${row.id}">
              <i class="zmdi zmdi-edit"></i>
            </a>
            <a class="delete button button-box button-xs button-danger" href="/baseInformation/codeTableList/delete/${row.id}" onclick="return confirm('آیا از عملیات حذف مطمين هستید؟');" >
              <i class="zmdi zmdi-delete"></i>
            </a>
            </div>
          </div>
        `;
        },
      },
      { data: "fa_createdAt" },
      { data: "creator.username" },
    ],
    columnDefs: [
      { target: 3, className: 'text-center' },
      { target: 4, className: 'text-center' },
    ],

    order: [[0, "desc"]], // مرتب‌سازی پیش‌فرض بر اساس حقوق به صورت نزولی
    lengthMenu: [15, 25, 50, 100], // مقادیر سفارشی
    language: {
      search: "هر کدام از موارد را می توانید اینجا جستجو کنید ...:",
      lengthMenu: "نمایش _MENU_ ردیف در هر صفحه",
      info: "نمایش _START_ تا _END_ از _TOTAL_ ردیف",
      infoFiltered: "(فیلتر شده از مجموع _MAX_ رکورد)",
      infoEmpty: "رکوردی یافت نشد",
      emptyTable: "هیچ داده‌ای موجود نیست",
      loadingRecords: "در حال بارگذاری...",
      processing: "در حال پردازش...",
      paginate: {
        next: "بعدی",
        previous: "قبلی",
      },
      zeroRecords: "هیچ داده‌ای پیدا نشد!",
    },
  });
});
