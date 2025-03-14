$(document).ready(function () {
  $('#userListDataTable').DataTable({
    ajax: {
      url: '/admin/users/api/getData',
      dataSrc: ''
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        }
      },
      { data: 'username' },
      { data: 'person.fullName' },
      {
        data: 'isActive',
        orderable: false,
        render: function (data, type, row) {
          if (type === 'display') {
            return `<input type="checkbox" class="active-toggle"
              ${data ? 'checked' : ''}
              data-id="${row.id}" />`;
          }
          return data; // در حالت داده‌ی خام، مقدار اصلی را برمی‌گرداند
        }
      },
      { data: 'fa_createdAt' },
      { data: 'username' },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
          <div class="row-table text-center">
            <div class= "11table-action-buttons"> 
            <a class="edit button button-box button-xs button-info" href="/admin/users/edit/${row.id}">
              <i class="zmdi zmdi-edit"></i>
            </a>
            <a class="delete button button-box button-xs button-danger" href="/admin/users/delete/${row.id}" onclick="return confirm('آیا از عملیات حذف مطمين هستید؟');" >
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
      { target: 3, className: 'text-center' },
      { target: 4, className: 'text-center' },
      { target: 5, className: 'text-center' }
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

$('#userListDataTable').on('change', '.active-toggle', function () {
  const isChecked = $(this).is(':checked');
  let msg = 'فعال';
  if (!isChecked) {
    msg = 'غیر فعال';
  }

  const id = $(this).data('id');
  $.ajax({
    url: `/admin/users/api/updateUserActive/${id}`,
    method: 'POST',
    data: JSON.stringify({ isActive: isChecked }),
    contentType: 'application/json',
    success: function (response) {
      alert(`کاربر ${msg} شد.`);
    }
  });
});
