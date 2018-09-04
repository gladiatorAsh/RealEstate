  //Add dependency loading using require.js

  //Setting toastr options
  toastr.options.progressBar = true;
  toastr.options.timeOut = 30;
  toastr.options.closeButton = true;
  toastr.options.preventDuplicates = true;
  toastr.options.showMethod = 'slideDown';
  toastr.options.hideMethod = 'slideUp';
  toastr.options.closeMethod = 'slideUp';
  toastr.options.showEasing = 'swing';
  toastr.options.hideEasing = 'linear';
  toastr.options.closeEasing = 'linear';


  //Setting Ajax options
  $.ajaxSetup({
      cache: false,
      tryCount: 0,
      retryLimit: 3,
      error: function (xhr, textStatus, errorThrown) {
          $.unblockUI();
          // Spin.stopSpin();

          if (xhr.status == 404) {
              console.log("Service not found");
              toastr.error("Something went wrong!! Please try again later ",
                  "Service Error");
              return;
          }
          if (xhr.status == 401) {
              console.log("Unauthorized");
              toastr.error("You are not authorized to perform this operation",
                  "Service Error");
              return;
          }
          if (xhr.status == 400) {
              console.log("Bad Request");
              toastr.error(
                  "Error occurred while processing the request. Please try again later ",
                  "Service Error");
              return;
          }
          if (textStatus == "timeout") {
              /**
               * If timeout occurs, retry; default no. of retries  are 3
               * After 3 retries, exit and show error.
               */
              this.tryCount++;
              if (this.tryCount < this.retryLimit) {
                  $.ajax(this);
                  return;
              } else {
                  console.log('Repeated timeout error');
                  toastr.error("Request timeout. Please try after some time.",
                      "Service Error");
                  return;
              }
              if (xhr.status == 500) {
                  console.log("Internal server error");
                  toastr.error(
                      "Error occurred while processing the request , Please try again later.",
                      "Service Error");
                  return;
              } else {
                  console.log("Please contact the administrator");
                  toastr.error("Error occurred while processing the request.",
                      "Service Error");
                  return;
              }
          }
      }
  });