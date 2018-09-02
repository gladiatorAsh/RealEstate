var Zillow = {
    endpoint: "http://localhost:3600/",

    urlGetRentEstimate: "zillow/getRentEstimate",
    urlPostPersonalDetails: "users",
    urlPostUserEstimate: "zillow/postUserEstimate/",
    urlgetClientIP: "https://api.ipify.org",
    urlUpdateAddress: "users/",

    userIP: "",
    userId: -1,

    dvPersonalDetails: $('#dvPersonalDetails'),
    frmPersonalDetails: $('#frmPersonalDetails'),
    btnSubmitfrmPersonalDetails: $('#btnSubmitfrmPersonalDetails'),
    isPersonalDetailSubmitted: false,

    txtAddress1: $('#address1'),
    txtCity: $('#city'),
    txtState: $('#state'),
    txtZip: $('#zipcode'),


    spanRentZestimate: $('#rentZestimate'),
    spanRentZestimateLow: $('#rentZestimateLow'),
    spanRentZestimateHigh: $('#rentZestimateHigh'),
    txtUserEstimate: $('#userEstimate'),

    dvAddress: $('#dvAddress'),
    frmAddress: $('#frmAddress'),
    btnSubmitAddress: $('#btnSubmitAddress'),
    isAdressSubmitted: false,

    dvStatus: $('#dvStatus'),
    txtUserEstimate: $('#userEstimate'),
    btnSubmitEstimate: $('#btnSubmitEstimate'),
    isEstimateSubmitted: false,

    init: function () {
        /*
        this.btnSubmitfrmPersonalDetails.click(this.submitPersonalDetails);
        this.btnSubmitAddress.click(this.submitAddress);
        this.btnSubmitEstimate.click(this.submitStatus);
        this.frmPersonalDetails.validator().submit(alert('Form validated'));
        this.frmAddress.validator().submit(alert('Form validated'));
        */

        this.btnSubmitEstimate.click(this.submitStatus);
        this.frmPersonalDetails.validator().on('submit', function (e) {
            if (e.isDefaultPrevented()) {
                alert('Please check details');
            } else {
                e.preventDefault();
                Zillow.submitPersonalDetails(e);
            }
        })


        this.frmAddress.validator().on('submit', function (e) {
            if (e.isDefaultPrevented()) {
                alert('Please check details');
            } else {
                e.preventDefault();
                Zillow.submitAddress(e);
            }
        })
    },
    updateIP: function (result) {
        alert(result);
        Zillow.userIP = result;
    },
    submitPersonalDetails: function (event) {
        console.log($(this));
        console.log(event);
        alert('Inside submit');
        //$(this).val('Submitted');
        //Zillow.dvPersonalDetails.hide();
        //Zillow.dvAddress.show();
        Zillow.getClientIP(this.urlgetClientIP, this.updateIP).then(function (result) {
            var data = Zillow.getFormData(Zillow.frmPersonalDetails);

            data.ip = Zillow.userIP;
            console.log(data);

            Zillow.sendPost(Zillow.endpoint + Zillow.urlPostPersonalDetails, data, Zillow.successPersonalDetails);
        });
        return false;
    },
    successPersonalDetails: function (result) {
        Zillow.userId = result.id;
        console.log(Zillow.userId);
        alert(Zillow.userId);
        Zillow.dvPersonalDetails.hide();
        Zillow.dvAddress.show();
    },
    submitAddress: function (event) {
        //console.log($(this).val());
        alert('Inside submit Address');
        //$(this).val('Submitted');
        //Zillow.dvAddress.hide();
        var data = Zillow.getFormData(Zillow.frmAddress);
        data.address = data.address1 + " " + data.address2;
        console.log(data);
        alert(Zillow.userId);
        alert(Zillow.userIP);
        Zillow.sendUpdate(Zillow.endpoint + Zillow.urlUpdateAddress + Zillow.userId, data, Zillow.successAddress);
        return false;
    },
    successAddress: function (result) {
        Zillow.userId = result.id;

        var data = {
            "userId": Zillow.userId,
            "address": Zillow.txtAddress1.val(),
            "citystatezip": Zillow.txtZip.val() || (Zillow.txtCity.val() + "," + Zillow.txtState.val())
        }

        Zillow.sendPost(Zillow.endpoint + Zillow.urlGetRentEstimate, data, Zillow.successRentEstimate);

        Zillow.dvAddress.hide();
        Zillow.dvStatus.show();

    },
    successRentEstimate: function (result) {
        alert('Rent shown');
        //Update UI
        if (result == null) {
            alert('Information is unavailable for this address. Please refresh and try another');
            return;
        }

        Zillow.spanRentZestimate.text('$' + result.amount);
        Zillow.spanRentZestimateHigh.text(' - ' +'$' + result.valuationRange.high);
        Zillow.spanRentZestimateLow.text('$' + result.valuationRange.low);
        Zillow.spanRentZestimateLow.addClass('green');
        Zillow.spanRentZestimateHigh.addClass('red');

        console.log(result);

    },
    submitStatus: function (event) {
        //console.log($(this).val());
        $(this).val('Submitted');
        //Zillow.dvStatus.hide();
        var data = {
            "userId": Zillow.userId,
            "userExpectation": Zillow.txtUserEstimate.val() || -1
        }

        Zillow.sendPost(Zillow.endpoint + Zillow.urlPostUserEstimate, data, this.successStatus);
        alert('An email has been sent about your query today.');
        Zillow.dvStatus.hide();
        return false;
    },
    successStatus: function (result) {
        alert('An email has been sent about your query today.');
    },
    getFormData: function (obj) {
        var out = {};
        var s_data = obj.serializeArray();
        //transform into simple data/value object
        for (var i = 0; i < s_data.length; i++) {
            var record = s_data[i];
            out[record.name] = record.value;
        }
        return out;
    },
    getClientIP: function (url, callback) {
        alert('Inside Client IP');
        var promise = $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
            function (json) {
                Zillow.updateIP(json.ip);
                //document.write("My public IP address is: ", json.ip);
            }
        );


        //return callback;
        return promise;
    },
    sendPost: function (url, data, callback) {
        alert('Inside send post');
        alert(url);
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: (result) => {
                callback(result);
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    sendUpdate: function (url, data, callback) {
        console.log(data);

        $.ajax({
            type: 'PATCH',
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (result) {
                callback(result);
            },
            error: function (err) {
                console.log(err);
            }

        });
    }

};