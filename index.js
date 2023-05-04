const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const USER_ID = "d91bdfa5-d45d-4cce-8be8-53a24f7a1524";
app.get("/getToken", cors(), async (req, res) => {
	const TOKEN_ENDPOINT =
		"https://us-central1-sparrow-uat.cloudfunctions.net/generateIdToken";

	try {
		const requestTokenResponse = await axios.get(TOKEN_ENDPOINT, {
			params: {
				uid: USER_ID,
			},
		});

		res.status(200).send(requestTokenResponse.data.idToken);
	} catch (ex) {
		res.status(500).send(ex);
	}
});

app.get("/initiateEmailVerification", cors(), async (req, res) => {
	try {
		const { requestToken, enteredEmail } = req.query;
		const data = JSON.stringify({
			newEmail: enteredEmail,
		});
		console.log("Starting..");
		const config = {
			method: "post",
			url: "https://api-uat.sparrowcard.com/lords/api/v1/users/d91bdfa5-d45d-4cce-8be8-53a24f7a1524/initiate-email-verification",
			headers: {
				Authorization: `Bearer ${requestToken}`,
				"Content-Type": "application/json",
			},
			data: data,
		};
		const result = await axios(config);
		console.log("initiate email: ", result.data);
		res.status(200).send(result.data);
	} catch (ex) {
		console.log("Exception", ex.response.data);
		res.status(500).send(ex.response.data);
	}
});

app.get('/verifyEmailOtp', cors(), async (req, res) => {
    const { requestToken, otp, requestId  } = req.query;
    var payload = JSON.stringify({
		otp,
        requestId
	});
    const config = {
        method: "post",
        url: "https://api-uat.sparrowcard.com/lords/api/v1/users/d91bdfa5-d45d-4cce-8be8-53a24f7a1524/verify-email-otp",
        headers: {
            Authorization: `Bearer ${requestToken}`,
            "Content-Type": "application/json",
        },
        data: payload
    };
    try {
        const userDetails = await axios(config);
        return res.status(200).send(userDetails.data);
    } catch (ex) {
        console.log(ex.response.data);
        res.status(500).send(ex.response.data);
    }
});

app.get("/getUser", cors(), async (req, res) => {
	const GET_USER_ENDPOINT = `https://api-uat.sparrowcard.com/lords/api/v1/users/${USER_ID}`;
	const { requestToken } = req.query;
	try {
		const userDetails = await axios.get(GET_USER_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${requestToken}`,
				"Content-Type": "application/json",
			},
		});
		console.log(userDetails);
		res.status(200).send(userDetails.data);
	} catch (ex) {
		console.log(ex);
		res.status(500).send(ex);
	}
});

app.get("/changeCommPreference", (req, res) => {
	const { requestToken, enableLetter } = req.query;
	console.log("BodyContent: ", req.body);
	var data = JSON.stringify({
		preferences: {
			communicationPreferences: {
				enableLetter: enableLetter,
			},
		},
	});

	var config = {
		method: "patch",
		url: "https://api-uat.sparrowcard.com/lords/api/v1/users/d91bdfa5-d45d-4cce-8be8-53a24f7a1524",
		headers: {
			Authorization: `Bearer ${requestToken}`,
			"Content-Type": "application/json",
		},
		data: data,
	};

	axios(config)
		.then(function ({ data }) {
			res.status(200).send(data);
		})
		.catch(function (error) {
			console.log(error);
			res.status(500).send(error);
		});
});

app.get("/updateName", (req, res) => {
	const { requestToken, nameObj } = req.query;
	const { firstName, middleName, lastName } = nameObj;
	var payload = JSON.stringify({
		name: {
			firstName,
			middleName,
			lastName,
		},
	});

	var config = {
		method: "patch",
		url: "https://api-uat.sparrowcard.com/lords/api/v1/users/d91bdfa5-d45d-4cce-8be8-53a24f7a1524",
		headers: {
			Authorization: `Bearer ${requestToken}`,
			"Content-Type": "application/json",
		},
		data: payload,
	};

	axios(config)
		.then(function ({ data }) {
			res.status(200).send(data);
		})
		.catch(function (error) {
			console.log(error);
			res.status(500).send(error.response.data);
		});
});

app.get("/updateAddress", (req, res) => {
	const { requestToken, addressObj } = req.query;
    console.log('Address obj: ', addressObj);
	const { line1, line2, city, state, zipCode, type } = addressObj;
	var payload = JSON.stringify({
		line1,
		line2,
		city,
		state,
		zipCode,
		type,
	});

	var config = {
		method: "patch",
		url: "https://api-uat.sparrowcard.com/lords/api/v1/users/d91bdfa5-d45d-4cce-8be8-53a24f7a1524/address",
		headers: {
			Authorization: `Bearer ${requestToken}`,
			"Content-Type": "application/json",
		},
		data: payload,
	};

	axios(config)
		.then(function ({ data }) {
			res.status(200).send(data);
		})
		.catch(function (error) {
			console.log(error);
			res.status(500).send(error.response.data);
		});
});

app.get("/updateIncomeInfo", (req, res) => {
	const { requestToken, incomeObj } = req.query;
    console.log('Income obj: ', incomeObj);
	const { monthlyIncome, housingDetails } = incomeObj;
	var payload = JSON.stringify({
		monthlyIncome,
        housingDetails
	});

	var config = {
		method: "patch",
		url: "https://api-uat.sparrowcard.com/lords/api/v1/users/d91bdfa5-d45d-4cce-8be8-53a24f7a1524/income-details",
		headers: {
			Authorization: `Bearer ${requestToken}`,
			"Content-Type": "application/json",
		},
		data: payload,
	};

	axios(config)
		.then(function ({ data }) {
			res.status(200).send(data);
		})
		.catch(function (error) {
			console.log(error);
			res.status(500).send(error.response.data);
		});
});

app.listen(5001, () => {
	console.log(`Server is current running on port 5001@ http://localhost:5001`);
});
