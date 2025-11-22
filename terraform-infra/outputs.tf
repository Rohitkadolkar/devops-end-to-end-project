output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  value = module.eks.cluster_certificate_authority_data
}

output "cluster_oidc_issuer_url" {
  value = module.eks.cluster_oidc_issuer_url
}

output "cluster_id" {
  value = module.eks.cluster_id
}

output "node_group_ids" {
  value = {
    for name, ng in module.eks.eks_managed_node_groups :
    name => ng.node_group_id
  }
}

output "node_group_roles" {
  value = {
    for name, ng in module.eks.eks_managed_node_groups :
    name => {
      iam_role_arn  = ng.iam_role_arn
      iam_role_name = ng.iam_role_name
    }
  }
}
