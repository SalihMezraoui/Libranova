package com.libranova.spring_boot_library.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class RetrieveJWT {
    public static String getJWT(String tokenHeader, String expectedClaim)
    {
        tokenHeader.replace("Bearer ", "");

        String[] tokenParts = tokenHeader.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(tokenParts[1]));

        String[] payloadParts = payload.split(",");

        Map<String, String> payloadMap = new HashMap<>();

        for (String part : payloadParts) {
            String[] keyValue = part.split(":");
            if (keyValue[0].equals(expectedClaim)) {

                int removeQuotes = 1;
                if (keyValue[1].endsWith("}")) {
                    removeQuotes = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - removeQuotes);
                keyValue[1] = keyValue[1].substring(1);

                payloadMap.put(keyValue[0], keyValue[1]);
            }
        }
        if (payloadMap.containsKey(expectedClaim)) {
            return payloadMap.get(expectedClaim);
        }

        return null;
    }
}
