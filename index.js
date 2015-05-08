var _ = require('lodash');
var DoorConnection = require('./modules/connection.js');
var Integrations = require('./modules/integrations.js');

//var five = require('johnny-five');
//var board = new five.Board();

var initRun = true;
var doorOldState;

//board.on('ready', function ()
//{
//       API key                Door ID
DoorConnection.setApiKey('apiKey123').listenToDoor('TikPnzpZfTMFXFvYH', function (doorNewState)
{// On initial run, the current state of the door object is fetched and stored

	console.log('New door state...');
	if (initRun)
	{
		doorOldState = doorNewState;
		initRun = false;
	}
	else
	{
		for (var i = 0; i < doorNewState.users_with_access.length; i++)
		{
			var user = doorNewState.users_with_access[i];

			if (_.isEqual(user, doorOldState.users_with_access[i]))
			{
				// If no changes has been done to this user
				// Didn't find a _.isNotEqual, so went with this instead
			}
			else
			{
				if (_.isEqual(user.integrations, doorOldState.users_with_access[i].integrations))
				{
					// When the user gets home, start Integrations
					if (user.is_home !== doorOldState.users_with_access[i].is_home && user.is_home)
					{
						// User 'entered' door
						//Integrations.sendNotificationToDoorOwner(user, door, 'entered')
						for (var j = 0; j < user.integrations.length; j++)
						{
							var integration = user.integrations[j];

							if (integration.name === "TV" && integration.active)
							{
								Integrations.turnOnTV();
							}
							else if (integration.name === "Livingroom Light" && integration.active)
							{
								Integrations.turnOnLight();
							}
							else if (integration.name === "Push notification" && integration.active)
							{
								// Integrations.sendNotificationToDoorOwner(user, door, 'entered')
							}
						}
					}
					else
					{
						// User 'exited' door
						//Integrations.sendNotificationToDoorOwner(user, door, 'exited')

						for (var j = 0; j < user.integrations.length; j++)
						{
							var integration = user.integrations[j];

							if (integration.name === "TV" && integration.active)
							{
								Integrations.turnOffTV();
							}
							else if (integration.name === "Livingroom Light" && integration.active)
							{
								Integrations.turnOffLight();

							}
							else if (integration.name === "Push notification" && integration.active)
							{
								// Integrations.sendNotificationToDoorOwner(user, door, 'entered')
							}
						}
					}
				}
				else
				{
					// The Integrations where modified from the app, and the Integrations should NOT run now.
					console.log('The Integrations where modified from the app, and the Integrations should NOT run now.');
				}
			}
		}
		doorOldState = doorNewState;
	}
});
//});
