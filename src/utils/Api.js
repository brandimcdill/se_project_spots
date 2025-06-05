class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1", {
      headers: {
        authorization: "ccc1108b-0e43-4488-be9b-8eb1c8ff494e",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
