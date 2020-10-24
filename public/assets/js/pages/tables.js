// const Route = new Routes;

const insertExpensesData = async () => {
  const { data } = await getExpensesData();
  console.log(data)
  
	// paginated table
		var datatable = $('.kt_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'local',
				source: data,
				pageSize: 10,
			},

			// layout definition
			layout: {
				scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
				footer: false // display/hide footer
			},

			// column sorting
			sortable: false,

			pagination: true,

			search: {
				input: $('#generalSearch')
			},

			// columns definition
			columns: [
        // {
				// 	field: 'UserId',
        //   title: '#',
        //   width: 60,
				// 	type: 'number',
        // },
        {
          field: 'id',
          title: 'ID',
          type: 'number',
        }, 
        {
          field: 'title',
          title: 'Title',
          template: function(row) {
            return row["data.title"];
          }
        },
        {
            field: 'amount',
            title: 'Amount',
            template: function(row) {
                return row["data.amount"];
            }
        }, 
        {
            field: 'status',
            title: 'Status',
            template: function(row) {
              return row["data.status"];
            }
        },
        {
            field: 'employee',
            title: 'Employee',
            template: function(row) {
              return row["data.employee_id"];
            }
        },
        {
            field: 'time',
            title: 'Time',
            template: function(row) {
              return row["data.createdAt"];
            }
        },
        // {
        //   field: 'amount',
        //   title: 'Amountn',
        //   template: function(row) {
        //     return row["User.firstname"] + ' ' + row["User.lastname"];
        //   }
        // }, 
        {
					field: 'totalSubmissions',
					title: 'Submissions',
					type: 'number',
          width: 100,
        }
      ],

		});

    $('#kt_form_status').on('change', function() {
      datatable.search($(this).val().toLowerCase(), 'status');
    });

    $('#kt_form_type').on('change', function() {
      datatable.search($(this).val().toLowerCase(), 'type');
    });

    $('#kt_form_status,#kt_form_type').selectpicker();

};

const getExpensesData = async () => {
  try {
    const expenses = await fetch(`127.0.0.1:3000/test`, {
      // mode: 'no-cors',
      method: 'GET'
    });
    return await expenses.json();
  } catch (error) {
  console.log(error);
    // show network error notification
    swal.fire(
      'Oops!',
      'An error was encountered! Please review your network connection.',
      'error'
    )
  }
}
