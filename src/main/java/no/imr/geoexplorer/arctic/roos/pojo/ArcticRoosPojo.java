package no.imr.geoexplorer.arctic.roos.pojo;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties({ "idParametertree","idParameter" })
public class ArcticRoosPojo {
	private Long id;
	private Long idParametertree;
	private Long idParameter;
	private String text;
	private Boolean leaf = false;	
	
	public Boolean getLeaf() {
		return leaf;
	}
	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getIdParametertree() {
		return idParametertree;
	}
	public void setIdParametertree(Long idParametertree) {
		this.idParametertree = idParametertree;
	}
	public Long getIdParameter() {
		return idParameter;
	}
	public void setIdParameter(Long idParameter) {
		this.idParameter = idParameter;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
}
