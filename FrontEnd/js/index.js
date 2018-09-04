//Add dependency loading using require.js

var Zillow = {
    endpoint: "http://34.212.106.242:3600/",

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

        this.btnSubmitEstimate.click(this.submitStatus);
        this.frmPersonalDetails.validator().on('submit', function (e) {
            if (e.isDefaultPrevented()) {
                alert('Please check details');
            } else {
                e.preventDefault();
                Zillow.submitPersonalDetails(e);
            }
        });


        this.frmAddress.validator().on('submit', function (e) {
            if (e.isDefaultPrevented()) {
                alert('Please check details');
            } else {
                e.preventDefault();
                Zillow.submitAddress(e);
            }
        });
    },
    updateIP: function (result) {
        console.log(result);
        Zillow.userIP = result;
    },
    submitPersonalDetails: function (event) {

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

        Zillow.dvPersonalDetails.hide();
        Zillow.dvAddress.show();
    },
    submitAddress: function (event) {

        var data = Zillow.getFormData(Zillow.frmAddress);
        data.address = data.address1 + " " + data.address2;
        console.log(data);
        Zillow.sendUpdate(Zillow.endpoint + Zillow.urlUpdateAddress + Zillow.userId, data, Zillow.successAddress);
        return false;
    },
    successAddress: function (result) {
        Zillow.userId = result.id;

        var data = {
            "userId": Zillow.userId,
            "address": Zillow.txtAddress1.val(),
            "citystatezip": Zillow.txtZip.val() || (Zillow.txtCity.val() + "," + Zillow.txtState.val())
        };

        Zillow.sendPost(Zillow.endpoint + Zillow.urlGetRentEstimate, data, Zillow.successRentEstimate);

        Zillow.dvAddress.hide();
        Zillow.dvStatus.show();

    },
    successRentEstimate: function (result) {

        //Update UI
        if (result == null) {
            alert('Information is unavailable for this address. Please refresh and try another');
            return;
        }

        Zillow.spanRentZestimate.text('$' + result.amount);
        Zillow.spanRentZestimateHigh.text(' - ' + '$' + result.valuationRange.high);
        Zillow.spanRentZestimateLow.text('$' + result.valuationRange.low);
        Zillow.spanRentZestimateLow.addClass('green');
        Zillow.spanRentZestimateHigh.addClass('red');

        console.log(result);

    },
    submitStatus: function (event) {

        $(this).val('Submitted');

        var data = {
            "userId": Zillow.userId,
            "userExpectation": Zillow.txtUserEstimate.val() || -1
        };

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
        $.blockUI();
        // Spin.startSpin();

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (result) {
                $.unblockUI();
                callback(result);
            },
            error: function (err) {
                $.unblockUI();
                console.log(err);
            }
        });
    },
    sendUpdate: function (url, data, callback) {
        console.log(data);
        $.blockUI();
        //Spin.startSpin();

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
                $.unblockUI();
                callback(result);
            },
            error: function (err) {
                $.unblockUI();
                console.log(err);
            }

        });
    }

};