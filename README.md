<img src="https://user-images.githubusercontent.com/24829816/86973737-19bfcc80-c186-11ea-8150-27d377cb68e0.png" alt="hive-greeter-logo" width=200>

### STEP 1: Add Discord Bot to your Server
<details>
<summary>Reveal Steps</summary>
<br>
  
| Screens | Steps |
| :---: | :-- |
| ![image](https://user-images.githubusercontent.com/24829816/87160923-cdcf6d80-c2d4-11ea-9a0b-dd489829bd70.png) | 1. Open Discord developers [portal](https://discord.com/developers/applications/)<br><br>Click `New Application` |
| ![image](https://user-images.githubusercontent.com/24829816/87163841-040eec00-c2d9-11ea-8564-75dc5d982dfa.png) | 2. Give your BOT a new name and click `Create` |
| ![image](https://user-images.githubusercontent.com/24829816/87161737-002d9a80-c2d6-11ea-9676-6c5d3c91f01f.png)| 3. Customize your bot by giving an Image and description.|
| ![image](https://user-images.githubusercontent.com/24829816/87161999-60bcd780-c2d6-11ea-85e1-7fb7fdafbfde.png)| 4. Under the `Bot` tab, click `Add Bot` |
|![image](https://user-images.githubusercontent.com/24829816/87162504-138d3580-c2d7-11ea-80dd-389fe6c1da1e.png) | 5. Set `Icon` and `Username` 
| ![image](https://user-images.githubusercontent.com/24829816/87164102-64059280-c2d9-11ea-821f-8d951886a98f.png) | 6. Go to `OAuth2` tab. <br><br>Tick the `bot` checkbox under **scopes**.<br><br>You can customize your BOT by setting the **Bot Permissions**.<br><br>Note changing the permissions updates the `link` that'll be used to invite your bot to your server. |
|![image](https://user-images.githubusercontent.com/24829816/87163479-7b904b80-c2d8-11ea-8296-05c3a952c022.png) | <b>Inviting Your Bot</b><br>when you open the link from the step above, in a new tab you'll see the following page and now you can add the bot to any of your server |

> find detailed steps [here](https://discordpy.readthedocs.io/en/latest/discord.html)

</details>

### STEP 3: Deploying Bot on Heroku
<details>
<summary>Reveal Steps</summary>
<br>
  
1. Install [Heroku Cli](https://devcenter.heroku.com/articles/heroku-cli)
2. login with your Heroku account credentials when you run
   ```
   $ heroku login
   ```
3. Now create an app with name your-app-name by running:
   ```
   $ heroku create your-app-name
   ```
4. add a Git remote named heroku pointing to Heroku:
   ```
   $ git remote add heroku https://git.heroku.com/your-app-name.git
   ```

**Integrating Heroku with GitHub**, *This step is required if you plan on automatically deploying your bot every time you push changes to a GitHub repository*. ([detailed steps here](https://devcenter.heroku.com/articles/github-integration))

5. Select your app from the [Heroku Dashboard](https://dashboard.heroku.com/apps).
6. Go to `Deploy` tab of app, 
   * **Enabling GitHub integration**: To configure GitHub integration, you have to authenticate with GitHub. You only have to do this once per Heroku account.
   * **App Connected to Github**: you have to select the repository with your Bot.
   * **Automatic deploys**: When you enable automatic deploys for a GitHub branch, Heroku builds and deploys all pushes to that branch.
   ![image](https://user-images.githubusercontent.com/24829816/87197633-83b5ae80-c30b-11ea-95c3-1ae107f8a26c.png)

**Testing your setup**, This step is not required, but it's highly recommended. You should build your application locally to test if you've set up it correctly.
```
$ heroku local
```
The Heroku CLI will now run your app at http://localhost:5000/; if no errors are encountered, you're on the right track!

7. Go to `Settings` tab of app to set your discord bot token in `config vars` section.
   ![image](https://user-images.githubusercontent.com/24829816/87199962-a09eb180-c30c-11ea-9056-42f70d64b0d3.png)

8. **Deploying your bot** Upon reaching this step you should have:
   * developed a functioning Discord bot
   * setup your repository for Heroku deployment
   
   If all goes well, you can now deploy your app to Heroku by running:
   ```
   $ git push heroku master
   ```
   **Note**: If you have setup Automatic Deploys, you'll able to deploy your app with every commit to your master branch.

***

On completion of the above steps Heroku Cli will give you a link to your hosted app something like this:
`https://you-app.herokuapp.com`. Most often than not you'll run into issues with your first deployment as might have some dependencies in dev-dependencies or some config issues.

if you run into any issues run
```
heroku logs --tail
```
***

> find detailed steps [here](https://elements.heroku.com/buildpacks/synicalsyntax/discord.js-heroku)
</details>
