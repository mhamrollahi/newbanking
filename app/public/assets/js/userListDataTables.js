
$(document).ready(function () {
  $("#userListDataTable").DataTable({
    ajax: {
      url: "/admin/users/api/getData",
      dataSrc: "",
    },
    columns: [
      { 
        data: null,
        render:function(data,type,row,meta){
          return meta.row + 1
        },
      },
      { data: "userName" },
      { data: "fullName" },
      { data: "fa_createdAt" },
      { data: "creator" },
      { data:null,
        render: function (data, type, row) {
          return `
          <div class="row-table text-center">
            <div class= "11table-action-buttons"> 
            <a class="edit button button-box button-xs button-info" href="/admin/usersList/edit/${row.id}">
              <i class="zmdi zmdi-edit"></i>
            </a>
            <a class="delete button button-box button-xs button-danger" href="/admin/usersList/delete/${row.id}" onclick="return confirm('آیا از عملیات حذف مطمين هستید؟');" >
              <i class="zmdi zmdi-delete"></i>
            </a>
            </div>
          </div>
        `;
        },
      }
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
