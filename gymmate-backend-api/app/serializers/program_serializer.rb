class ProgramSerializer < ActiveModel::Serializer
  attributes :id, :title, :description
  attributes :exercises, :views, :created_at, :updated_at, :message

  def message
    "success"
  end

end
