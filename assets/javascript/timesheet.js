        // Initialize Firebase
  var config = {
      apiKey: "AIzaSyBuOtOekstelptxC6GOqdNEKwyRapaP0As",
      authDomain: "timesheet-908e1.firebaseapp.com",
      databaseURL: "https://timesheet-908e1.firebaseio.com",
      projectId: "timesheet-908e1",
      storageBucket: "timesheet-908e1.appspot.com",
      messagingSenderId: "481030520227"
  };
  firebase.initializeApp(config);

  var database = firebase.database()
  var name = "";
  var destination = "";
  var time = "";
  var freq = "";
  $("#sub-1").click(function (event) {

      event.preventDefault();
      name = $("#inputName").val().trim();
      destination = $("#inputDestination").val().trim();
      time = $("#inputTime").val().trim();
      freq = $("#inputFrequency").val().trim();

      // Code for handling the push
      database.ref().push({
          name: name,
          destination: destination,
          time: time,
          freq: freq,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      $("input").val("");

  });
  database.ref().on("child_added", function (childSnapshot) {
          var name = childSnapshot.val().name;
          var destination = childSnapshot.val().destination;
          var time = childSnapshot.val().time;
          var freq = childSnapshot.val().freq;
          //converts the time
          var freq = parseInt(freq);
          //current time
          var currentTime = moment().format('ddd, Do MMMM  YYYY, h:mm:ss a');
          var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
          var trainTime = moment(dConverted).format('HH:mm');
          //Diffrence in time
          var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
          var tDifference = moment().diff(moment(tConverted), 'minutes');
          //remainder 
          var tRemainder = tDifference % freq;
          //min until next train
          var minsAway = freq - tRemainder;
          //next train
          var nextTrain = moment().add(minsAway, 'minutes');
          //adds the current time to the html for referance
          $('#currentTime').html(currentTime);
          //takes the data sent to firebase and returns and adds it to the html
          $('#trainTable').append(
              "<tr><td id='namePush'>" + childSnapshot.val().name +
              "</td><td id='destinationPush'>" + childSnapshot.val().destination +
              "</td><td id='timePush'>" + childSnapshot.val().time +
              "</td><td id='freqPush'>" + childSnapshot.val().freq +
              "</td><td id='nextPush'>" + moment(nextTrain).format("LT") +
              "</td><td id='awayPush'>" + minsAway + ' minutes' +
              "</td></tr>");

      });