$(document).ready(function () {
  $('#accountInfoListDataTable').DataTable({
    ajax: {
      url: '/accManagement/accountOpen/api/getData',
      dataSrc: ''
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        }
      },
      { data: 'accountNumber' },
      { data: 'accountTitle' },
      { data: 'organization.organizationName' },
      { data: 'organization.nationalCode' },
      { data: 'organization.budgetRow' },
      { data: 'accountType.title' },
      { data: 'requestLetterDate' },
      { data: 'requestLetterNo' },
      { data: 'bankBranchName_Code'},
      { data: 'province.title' },
      { data: 'creator.fullName' },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
          <div class="row-table text-center">
            <div class= "11table-action-buttons"> 
            <a class="edit button button-box button-xs button-info" href="/accountInfo/accountOpen/edit/${row.id}">
              <i class="zmdi zmdi-edit"></i>
            </a>
            <a class="delete button button-box button-xs button-danger" href="/accountInfo/accountOpen/delete/${row.id}" onclick="return confirm('آیا از عملیات حذف مطمين هستید؟');" >
              <i class="zmdi zmdi-delete"></i>
            </a>
            </div>
          </div>
        `;
        }
      }
    ],
    columnDefs: [
      { target: 0, className: 'text-center' },
      { target: 1, className: 'text-center' },
      { target: 2, className: 'text-center' },
      { target: 3, className: 'text-center' },
      { target: 4, className: 'text-center' },
      { target: 5, className: 'text-center' },
      { target: 6, className: 'text-center' },
      { target: 7, className: 'text-center' },
      { target: 8, className: 'text-center' },
      { target: 9, className: 'text-center' },
      { target: 10, className: 'text-center' },
      { target: 11, className: 'text-center' },
      { target: 12, className: 'text-center' },
    ],
    order: [[0, 'desc']], // مرتب‌سازی پیش‌فرض بر اساس ردیف به صورت نزولی
    lengthMenu: [15, 25, 50, 100], // مقادیر سفارشی
    language: {
      search: 'هر کدام از موارد را می توانید اینجا جستجو کنید ...:',
      lengthMenu: 'نمایش _MENU_ ردیف در هر صفحه',
      info: 'نمایش _START_ تا _END_ از _TOTAL_ ردیف',
      infoFiltered: '(فیلتر شده از مجموع _MAX_ رکورد)',
      infoEmpty: 'رکوردی یافت نشد',
      emptyTable: 'هیچ داده‌ای موجود نیست',
      loadingRecords: 'در حال بارگذاری...',
      processing: 'در حال پردازش...',
      paginate: {
        next: 'بعدی',
        previous: 'قبلی'
      },
      zeroRecords: 'هیچ داده‌ای پیدا نشد!'
    }
  });
});
