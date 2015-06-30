This project show how to publish rest service using camel under
OSGI environment.

camel config:
1.run karaf 3.0.3
2.feature:repo-add camel 2.15.2
3.feature:install war camel-blueprint camel-servlet camel-jackson
4.open IE,browse to : http://localhost:8181/camel-example-servlet-rest-blueprint/rest/user/findAll