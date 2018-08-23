    The purpose of the application is to test out Zillow APIs. It is currently under progress. to know more about Zillow APIs, please see -
    https://www.zillow.com/

1.   Features built-
        Backend
            1. API call to get rentzestimate if available or approximate it.
            2. User authentication and authorization.
            3. Model validation using mongoose
            4. Two tiered service access - Paid and Free
            
        Front end 
            1. User page to login
            2. User page to update user details

2.  To Do -
    1. Organize front-end code
    2. Improve css
    3. Add validation on front-end
    4. Handle and log errors on both front-end and back-end
    5. Implement circuit breaker pattern
    6. Use phone and email verification service
    7. Add user account creation page
    8. Refresh token to generate new token
    9. Dockerize and deploy

3. Zillow API -
    a. http://www.zillow.com/webservice/GetSearchResults.htm
        zws-id
        address
        citystatezip
        rentzestimate

        Rentzestimate is never seen in the o/p even if the documentation says so.

    b. http://www.zillow.com/webservice/GetZestimate.htm
        zws-id
        zpid
        rentzestimate

        Need to know zpid. Will need two calls.
    
    c.http://www.zillow.com/webservice/GetDeepSearchResults.htm?
        zws-id
        address
        citystatezip
        rentzestimate

    The last one works the best since I need to know only address and get both zestimate and rentzestimate.

4. Trying to fetch rent estimates for the following addresses - 
    1. 1314 The Alameda, Apt 132, San Jose, CA
    2. 2925 SW 4th Ave, Portland, OR
    3. 2615 SE 75th Ave, Portland, OR
    4. 7245 N Newell Ave, Portland, OR
    5. 4305 SE Ash St,Portland, OR
    6. 7052 N Wilbur Ave, Portland, OR
    7. 7708 SE Springwater Dr,Portland, OR
    8. Test Not an Address : Returns null.
    9. 1314 Thunderbrook Cir,Desoto, TX 75115
    10. 101 Deerwood Dr,Sonora, TX 76950
    11. 2221 S 9th St, Saint Joseph, MO 64503
    12. East View Apartments,800 E 21st St, Falls City, NE 68355
    13. 1806 Virginia Ave APT 3, North Bend, OR 97459
    14. 88059 5th St APT 12,Veneta, OR 97487
    15. 954 Albany St,Schenectady, NY 12307
    16. 157 Oak St,Binghamton, NY 13905
    17. 232 Birchwood Ave,Elmira Heights, NY 14903
    18. Royal Plaza Apartments,85 Scotland Rd, Pueblo, CO 81001
    19. 932 Peninsula Ave APT 302,San Mateo, CA 94401
    20. 1726 S Grant St, San Mateo, CA 94402
    21. 212 S El Camino Real, San Mateo, CA 94401
    22. 301 Rita Ln,Crescent City, FL 32112 : Only Zestimate available 
    23. 1300 The Alameda, San Jose, CA 95126
    24. 2114 Bigelow Ave, Seattle, WA 98109 : RentZestimate available

 











