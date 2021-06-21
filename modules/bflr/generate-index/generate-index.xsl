<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:mods="http://www.loc.gov/mods/v3" version="1.0">
    <xsl:output method="text" />   
    <xsl:variable name="uuid" select="/mods:mods/@ID"/>
    <xsl:template match="/">
        <xsl:variable name="collection" select="/mods:mods/mods:identifier[@type = 'collection']" />
        <xsl:variable name="title1" select="/mods:mods/mods:titleInfo[@xml:lang = 'ro'][1]/mods:title" />
        <xsl:variable name="title2" select="/mods:mods/mods:titleInfo[1]/mods:title" />
        <xsl:variable name="title">
            <xsl:choose>
                <xsl:when test="string-length($title1) = 0"><xsl:value-of select="$title2" /></xsl:when>
                <xsl:otherwise><xsl:value-of select="$title1" /></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="siglum" select="/mods:mods/mods:identifier[@type = 'dlri-siglum']" />
        
        <xsl:text>{</xsl:text>
        
        <xsl:text>"collection":</xsl:text>
        <xsl:text>"</xsl:text><xsl:value-of select="$collection" /><xsl:text>"</xsl:text>
        <xsl:text>,</xsl:text>
        
        <xsl:text>"title":</xsl:text>
        <xsl:text>"</xsl:text><xsl:call-template name="escapeQuote"><xsl:with-param name="pText" select="$title" /></xsl:call-template><xsl:text>"</xsl:text>
        <xsl:text>,</xsl:text>
        
        <xsl:text>"siglum":</xsl:text>
        <xsl:text>"</xsl:text><xsl:value-of select="$siglum" /><xsl:text>"</xsl:text>
        <xsl:text>,</xsl:text>
        
        <xsl:text>"text-url":</xsl:text>
        <xsl:text>"</xsl:text><xsl:value-of select="/mods:mods/mods:location/mods:url[@access = 'text-base-url']" /><xsl:text>"</xsl:text>
        <xsl:text>,</xsl:text>        

        <xsl:text>"text-key":</xsl:text>
        <xsl:text>"</xsl:text><xsl:value-of select="/mods:mods/mods:location/mods:url[@access = 'text-base-url']/@note" /><xsl:text>"</xsl:text>
        <xsl:text>,</xsl:text>        

        <xsl:text>"lowres-url":</xsl:text>
        <xsl:text>"</xsl:text><xsl:value-of select="/mods:mods/mods:location/mods:url[@access = 'lowres-scan-base-url']" /><xsl:text>"</xsl:text>
        <xsl:text>,</xsl:text>        

        <xsl:text>"lowres-key":</xsl:text>
        <xsl:text>"</xsl:text><xsl:value-of select="/mods:mods/mods:location/mods:url[@access = 'lowres-scan-base-url']/@note" /><xsl:text>"</xsl:text>
        <xsl:text></xsl:text>
        
        <xsl:text>}</xsl:text>        
    </xsl:template>
    
    <xsl:template name="escapeQuote">
        <xsl:param name="pText" select="."/>

        <xsl:if test="string-length($pText) >0">
        <xsl:value-of select="substring-before(concat($pText, '&quot;'), '&quot;')"/>

        <xsl:if test="contains($pText, '&quot;')">
        <xsl:text>\"</xsl:text>

        <xsl:call-template name="escapeQuote">
            <xsl:with-param name="pText" select="substring-after($pText, '&quot;')"/>
        </xsl:call-template>
        </xsl:if>
        </xsl:if>
    </xsl:template>    
</xsl:stylesheet>
