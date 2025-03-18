
$(document).ready(function () {
  const urlSegments = window.location.pathname.split('/');
  const recordId = urlSegments[urlSegments.length - 1]
  console.log(recordId)

  $("#codingData").DataTable({
    
    ajax: {
      url: `/baseInformation/codingData/api/getData/${recordId}`,
      dataSrc: "",
    },
    columns: [
      { data:null,
        render : function(data,type,row,meta){
          return meta.row + 1
        },
       },
      {
        data: "title",
        render: function (data, type, row) {
          return `
          <div class="row-table text-center">
            <span>${data}</span>
            <div class= "table-action-buttons"> 
            <a class="edit button button-box button-xs button-info" href="/baseInformation/codingData/edit/${row.id}">
              <i class="zmdi zmdi-edit"></i>
            </a>
            <a class="delete button button-box button-xs button-danger" href="/baseInformation/codingData/delete/${row.id}" onclick="return confirm('آیا از عملیات حذف مطمين هستید؟');" >
              <i class="zmdi zmdi-delete"></i>
            </a>
            </div>
          </div>
        `;
        },
      },
      {
        data: "description",
        render: function (data, type, row) {
          return `
          <div class="row-table text-center">
            <span>${data}</span>
            <div class= "table-action-buttons"> 
            <a class="edit button button-box button-xs button-info" href="/baseInformation/codingData/edit/${row.id}">
              <i class="zmdi zmdi-edit"></i>
            </a>
            <a class="delete button button-box button-xs button-danger" href="/baseInformation/codingData/delete/${row.id}" onclick="return confirm('آیا از عملیات حذف مطمين هستید؟');" >
              <i class="zmdi zmdi-delete"></i>
            </a>
            </div>
          </div>
        `;
        },
      },
      { data: "sortId" },
      { data: "refId" },
      { data: "fa_createdAt" },
      { data: "creator.fullName" },
    ],
    columnDefs: [
      { target: 0, className: 'text-center' },
      { target: 3, className: 'text-center' },
      { target: 4, className: 'text-center' },
      { target: 5, className: 'text-center' },
      { target: 6, className: 'text-center' },
    ],

    fixedHeader: true,
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
