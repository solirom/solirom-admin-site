<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0" version="3.0">
    <xsl:output method="xml" encoding="UTF-8" />   
    <xsl:variable name="entries" select="collection('?select=*.xml')"/>
    <xsl:variable name="selected-entries" select="$entries/tei:entryFree[tei:editor/@xml:id = ""]"/>
    <xsl:template match="$selected-entries[position() =  (1 to 120)]">
        <xsl:variable name="uuid" select="@xml:id"/>
        <xsl:result-document href="{concat($uuid, '.xml')}">
            <xsl:template match="@*|node()">
                <xsl:copy>
                    <xsl:apply-templates select="@*|node()"/>
                </xsl:copy>
            </xsl:template>
            <xsl:template match="tei:editor/@xml:id">
                <xsl:attribute name="xml:id">
                    <xsl:text>andrea.sere</xsl:text>
                </xsl:attribute>                
            </xsl:template>
        </xsl:result-document>
    </xsl:template>
</xsl:stylesheet>
