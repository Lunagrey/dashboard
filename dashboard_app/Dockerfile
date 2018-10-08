FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /home
COPY . .
RUN dotnet build

FROM microsoft/dotnet:2.1-runtime
COPY --from=build /home/bin/Debug/netcoreapp2.0/ ./
CMD ["dotnet", "dashboard_app.dll"]