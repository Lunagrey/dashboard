FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 8080

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ["dashboard_app/dashboard_app.csproj", "dashboard_app/"]
RUN dotnet restore "dashboard_app/dashboard_app.csproj"
COPY . .
WORKDIR "/src/dashboard_app"
RUN dotnet build "dashboard_app.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "dashboard_app.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "dashboard_app.dll"]
