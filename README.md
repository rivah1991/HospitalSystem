Installation Steps to Run the Project Locally
1. Clone the repository using the master branch
To begin, clone the project repository from GitHub using the master branch:


git clone -b master https://github.com/rivah1991/HospitalSystem.git
cd HospitalSystem
This will clone the project to your local machine and navigate you to the project directory.

2. Configure the database connection
The SQL Server connection string can be found in the appsettings.json file in the HospitalAPI project. If necessary, modify the parameters to match your local setup. Here is an example of the connection string:


"ConnectionStrings": {
  "HospitalConnection": "Server=localhost,1433;Database=HospitalDB;User Id=sa;Password=Naivo@1991;TrustServerCertificate=True;"
}
Make sure that the SQL Server is running and accessible via port 1433 (the default port in Docker). If you are using a different password or database, modify the corresponding values in this connection string.

3. Start SQL Server using Docker
In this project, SQL Server is run inside a Docker container. A docker-compose.yml file is provided to configure and launch the SQL Server container. To start the SQL Server container, run the following command:


docker-compose up -d
This will start SQL Server in a Docker container, and SQL Server will be accessible on port 1433 (by default).

4. Run database migrations (if using Entity Framework)
If the project uses Entity Framework for database management, you need to apply the migrations to update the database with the latest model changes. Run this command in the HospitalAPI directory:


dotnet ef database update
This will apply the database migrations and prepare the database for use.

5. Configure the Frontend (Angular)
Navigate to the front-end-app folder where the Angular frontend application is located:


cd front-end-app
Next, install the dependencies for the Angular project by running:


npm install
This will download and install all the necessary dependencies for the Angular application.

To start the frontend application, run the following command:


ng serve
The frontend application will then be accessible in your browser at the following address:
http://localhost:4200.

6. Start the Backend (.NET Core API)
Go back to the HospitalAPI directory:


cd ../HospitalAPI
Run the backend API by executing the following command:


dotnet run
The backend API will be available at the following address:
http://localhost:5000.

7. Access the Application
Once the previous steps are completed:

Open your browser and navigate to the Angular frontend interface at http://localhost:4200.
The backend API will be available at http://localhost:5000.
Summary of Main Commands:
Clone the repository:
git clone -b master https://github.com/rivah1991/HospitalSystem.git

Restore backend dependencies:
dotnet restore (if needed)

Start SQL Server with Docker:
docker-compose up -d

Apply database migrations:
dotnet ef database update

Install Angular frontend dependencies:
npm install

Start Angular server:
ng serve

Run the .NET Core API:
dotnet run
