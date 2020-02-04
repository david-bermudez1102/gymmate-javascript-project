class UserSerializer < ActiveModel::Serializer
  attributes :id
  has_one :account
  attributes :message

  def message
    "success"
  end
end
